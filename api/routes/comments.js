const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const connection = require('../../db')

// GET /comments
// Retrive a list with all comments
router.get('/', checkAuth, (request, response, next) => {

    const query = "SELECT id, username, commentContent FROM comments"

    connection.query(query, function(error, result){
        response.status(200).json({
            message: "Comments was fetched",
            comments: result
        })
    })
})

// POST /comments/:postsId
// Lets a signed in user comment on a post with a specific postId
// Body: {"username": "User1", "commentContent: "A comment on a post"}
router.post('/:postsId', checkAuth, (request, response, next) => {
    const id = request.params.postsId
    const comment = {
        username: request.body.username,
        commentContent: request.body.commentContent
    }
    if (comment.commentContent.length <= 2) {
        response.status(404).json({
            message: "Your comment must contain at least 3 characters"
        }).end()
    }
    const query = "INSERT INTO comments (username, commentContent) VALUES (?, ?)"
    const values = [comment.username, comment.commentContent]
    connection.query(query, values, function(error, result){
        if (error) {
            if (error.errno == 1452) {
                response.status(400).json({
                    error: "Username doesn't exist"
                })
            } else {
                response.status(500).json({
                    error: error
                }).end()
            }
        } else {
            response.setHeader("Location", "/comments/"+id)
            response.status(201).json({
                message: "Comment successfully created on post with id: " + id,
                createdComment: comment
            }).end()
        }
    })
})

// GET /comments/:commentId
// Retrieve a specific comment
router.get('/:commentId', (request, response, next) => {
    const commentId = request.params.commentId

    const query = "SELECT id, commentContent FROM comments WHERE id = ?"
    const values = [commentId]
    connection.query(query, values, (error, result) => {
        if (error) {
            response.status(500).json({
                error: error
            })
        } else {
            response.status(200).json({
                message: "Successfully retrived comment with id: "+commentId,
                commentDetails: result
            })
        }
    })
})

// DELETE /comments/:commentId
// Lets a signed in user delete a comment
router.delete('/:commentId', checkAuth, (request, response, next) => {
    const commentId = request.params.commentId

    const query = "DELETE FROM comments WHERE id = ?"
    const values = [commentId]

    connection.query(query, values, function(error, users){
        if (error) {
            response.status(400).json({
                error: error
            })
        } else {
            response.status(200).json({
                message: "Comment with id: "+commentId+ " was deleted"
            })
        }
    })
})

module.exports = router