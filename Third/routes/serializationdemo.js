var express = require('express');
var router = express.Router();
const serializer = require('express-serializer');


// Write our own custom serialization function
// or use our  ORM.
function serializeUsers(request, users) {
    return {
        myname: users.name,
        myemail: users.email,
        mydobdob: users.dob.getFullYear(),
        myhobbies: users.hobbies,
        myintrest: users.intrests,
    }
}

function serializeUsersOptions(request, users, options) {
    const serilized = {
        myname: `Name Is ${users.name}`,
        myhobbies: users.hobbies,
        myintrest: users.intrests,
    }
    if (options && options.includeDob) {
        serilized.mydobdob = users.dob.getFullYear();
    }
    if (options && options.includeEmail) {
        serilized.myemail = users.email;
    }
    return serilized;
}

//http://localhost:8000/users/?only=myname gets name it is similar to only and except
router.get('/users', (request, response, next) => {
    //Serializing Objects
    const users = {
        name: 'prabhanjan',
        email: 'prabhanjan@gmail.com',
        dob: new Date(),
        hobbies: ['eating', 'sleeping'],
        intrests: {
            sports: 'Cricket'
        },
    }
    serializer(request, users, serializeUsers).then(
        result => {
            response.send(result)
        }
    ).catch(next);
});

router.get('/getusers', (request, response, next) => {
    // Serializing Arrays
    const userList = [{
            name: 'abc',
            email: 'abc@gmail.com',
            dob: new Date(),
            hobbiles: ['a', 'b', 'c'],
            intrests: {
                a: 'x',
                b: 'y'
            }
        },
        {
            name: 'xyz',
            email: 'xyz@gmail.com',
            dob: new Date(),
            hobbies: ['x', 'y', 'z'],
            intrests: {
                x: 'a',
                y: 'b'
            }
        }
    ]
    serializer(request, userList, serializeUsers).then(
        result1 => {
            response.send(result1)
        }
    ).catch(next);
});

router.get('/getsomedetails', (request, response, next) => {
    const list = {
        name: 'prabhanjan',
        email: 'prabhanjan@gmail.com',
        hobbies: ['eating', 'sleeping'],
        intrests: {
            sports: 'Cricket'
        }
    }
    let options = {
        includeDob: false,
        includeEmail: true,
    }
    serializer(request, list, serializeUsersOptions, options).then(
        result2 => {
            response.send(result2);
        }
    ).catch(next);
});


router.get('/specificdetails', (request, response, next) => {
    const users = {
            name: 'prabhanjan',
            email: 'prabhanjan@gmail.com',
            dob: new Date(),
            hobbies: ['eating', 'sleeping'],
            intrests: {
                sports: 'Cricket'
            },
        }
        //only: 'myname' get only name
        // only: ['myname', 'myemail'] get email and name
        // except: 'myname' get all excpet myname
        //
    serializer(request, users, serializeUsers, { except: ['myname', 'myemail'] }).then(
        result3 => {
            response.send(result3);
        }
    ).catch(next);
});

function serilizehabits(request, hobbies) {
    return {
        myhobbies: hobbies.hobbie,
        myuser: hobbies.user
    }
}

router.get('/getfilter', (request, response, next) => {
    const users = {
        name: 'prabhanjan',
        email: 'prabhanjan@gmail.com',
        dob: new Date(),
        hobbies: [{ hobbie: ['eating', 'sleeping'], user: 'user1' }, { hobbie: ['playing', 'browsing'], user: 'user2' }],
        intrests: {
            sports: 'Cricket',
            education: 'b.tech'
        },
    }
    const mydata = []
    serializer(request, users.hobbies, serilizehabits, { only: 'myhobbies' }).then(
        resultdata => {
            console.log(resultdata);
        }
    )
    console.log(mydata);
    serializer(request, users, serializeUsers, { only: 'myintrest.sports' }).then(
        result4 => {
            response.send(result4);
        }
    )
})

module.exports = router;