const express = require('express')
const router = express.Router()

router.get('/', (request, response, next) => {
    response.status(200).json({
        message: "Comments was fetched"
    })
})

router.post('/', (request, response, next) => {
    response.status(201).json({
        message: "Comment was created"
    })
})

router.get('/:commentId', (request, response, next) => {
    const commentId = request.params.commentId
    response.status(200).json({
        message: "Comment details",
        commentId: commentId
    })
})

router.delete('/:commentId', (request, response, next) => {
    const commentId = request.params.commentId
    response.status(200).json({
        message: "Comment deleted",
        commentId: commentId
    })
})

module.exports = router