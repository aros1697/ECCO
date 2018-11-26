const express = require('express')
const router = express.Router()

// Fetch a list with user-accounts
router.get('/', (request, response, next) => {
    response.status(200).json({
        message: "User-accounts was fetched"
    })
})

router.post('/', (request, response, next) => {
    const user = {
        username: request.body.username,
        password: request.body.password,
        email: request.body.email
    }
    response.status(201).json({
        message: "Account was created",
        createdUser: user
    })
})

router.get('/:username', (request, response, next) => {
    const username = request.params.username
    if(username === 'Anton'){
        response.status(200).json({
            message: "The perfect username",
            username: username
        })
    } else {
        response.status(200).json({
            message: "The username is " +username
        })
    }
})

router.put('/:username', (request, response, next) => {
    response.status(200).json({
        message: "Updated profile!"
    })
})

router.delete('/:username', (request, response, next) => {
    response.status(200).json({
        message: "Deleted account!"
    })
})
module.exports = router