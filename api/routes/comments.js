const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, (request, response, next) => {
    response.status(200).json({
        message: "Comments was fetched"
    })
})

router.post('/', checkAuth, (request, response, next) => {
    response.status(201).json({
        message: "Comment was created"
    })
})

router.get('/:commentId', checkAuth, (request, response, next) => {
    const commentId = request.params.commentId
    response.status(200).json({
        message: "Comment details",
        commentId: commentId
    })
})

router.delete('/:commentId', checkAuth, (request, response, next) => {
    const commentId = request.params.commentId
    response.status(200).json({
        message: "Comment deleted",
        commentId: commentId
    })
})

module.exports = router