const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const connection = require('../../db')

router.get('/', checkAuth, (request, response, next) => {

    const query = "SELECT id, username, postContent FROM posts"

    connection.query(query, function(error, result){
        if (error) {
            response.status(500).json({
                error: error
            }).end()
        }
        response.status(200).json({
            message: "Posts was fetched",
            comments: result
        })
    })
})

// POST /posts
// Lets a signed in user make a post
// Body: {"username": "User1", "postContent": "A post"}
router.post('/', checkAuth, (request, response, next) => {
    const post = {
        username: request.body.username,
        postContent: request.body.postContent
    }
    if (post.postContent.length <= 2) {
        response.status(404).json({
            message: "Your comment must contain at least 3 characters"
        })
    }
    const query = "INSERT INTO posts (username, postContent) VALUES (?, ?)"
    const values = [post.username, post.postContent]

    connection.query(query, values, function(error, result){
        if (error) {
            response.status(500).json({
                error: error
            })
        } else {
            response.status(201).json({
                message: "Post successfully created",
                createdPost: post
            })
        }
    })
})

// GET /posts/:postId
// Retrieves a post with a specific id
router.get('/:postId', (request, response, next) => {
    const postId = request.params.postId

    const query = "SELECT id, postContent FROM posts WHERE id = ?"
    const values = [postId]
    connection.query(query, values, (error, result) => {
        if (error) {
            response.status(500).json({
                error: error
            })
        } else {
            response.status(200).json({
                message: "Successfully retrived post with id: "+postId,
                postDetails: result
            })
        }
    })
})

// DELETE /posts/:postId
// Lets a signed in user delete a comment
router.delete('/:postId', checkAuth, (request, response, next) => {
    const postId = request.params.postId

    const query = "DELETE FROM posts WHERE id = ?"
    const values = [postId]

    connection.query(query, values, function(error, result){
        if (error) {
            response.status(400).json({
                error: error
            })
        } else {
            response.status(200).json({
                message: "Post with id: "+postId+ " was deleted",
            })
        }
    })
})

module.exports = router