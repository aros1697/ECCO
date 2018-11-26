const express = require('express')
const app = express()
const morgan = require('morgan')

const postsRoutes = require('./api/routes/posts')
const commentsRoutes = require('./api/routes/comments')
const accountsRoutes = require('./api/routes/accounts')

app.use(morgan('dev'))
// Routes which should handle requests
app.use('/posts', postsRoutes)
app.use('/comments', commentsRoutes)
app.use('/accounts', accountsRoutes)

app.use((request, response, next) => {
    const error = new Error('Not found!')
    error.status = 404
    next(error)
})

app.use((error, request, response, next) => {
    response.status(error.status || 500)
    response.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app