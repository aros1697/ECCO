const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, (request, response, next) => {
    response.status(200).json({
        message: "Handling GET request to /posts"
    })
})

router.post('/', checkAuth, (request, response, next) => {
    const post = {
        postId: request.body.postId,
        username: request.body.username,
        postContent: request.body.postContent
    }
    response.status(201).json({
        message: "Handling POST request to /posts",
        createdPost: post
    })
})

router.get('/:postsId', checkAuth, (request, response, next) => {
    const id = request.params.postsId
    if(id === '1'){
        response.status(200).json({
            message: "Special ID",
            id: id
        })
    } else {
        response.status(200).json({
            message: "You passed an ID"
        })
    }
})
/*
router.put('/:postsId', (request, response, next) => {
    response.status(200).json({
        message: "Updated posts!"
    })
})

router.delete('/:postsId', (request, response, next) => {
    response.status(200).json({
        message: "Deleted posts!"
    })
})*/

module.exports = router