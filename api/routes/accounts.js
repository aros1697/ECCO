const express = require('express')
const router = express.Router()
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const connection = require('../../db')

const jwtSecret = "jknasbdhbsadvsavdagsdsdvraw"
var counter = 0

// Save uploads in folder /avatars and name it to the original filename
const storage = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, './avatars/')
    },
    filename: function(request, file, callback) {
        callback(null, file.originalname)
    }
})

// Accept only jpegs and pngs, reject other files
const fileFilter = (request, file, callback) => {
    if (file.mimetype === image/jpeg || file.mimetype === image/png) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

// Accept only images up to 5mb
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFiler: fileFilter
})

// GET /accounts
// Fetch a list with all user-accounts in database
router.get('/', (request, response, next) => {

    const query = "SELECT username, email, avatar FROM accounts"

    connection.query(query, function(error, result){
        response.status(200).json({
            message: "User-accounts was fetched",
            accounts: result
        })
    })
})

// POST /accounts/signup
// Signup with username, hashed password, email and avatar
// Body: {"username": "User1", "password": "123", "email": "email@example.com", "avatar": "img_123.jpg"}
router.post('/signup', upload.single('avatar'), (request, response, next) => {
    bcrypt.hash(request.body.password, 10, (err, hash) => {
        if (err) {
            return response.status(500).json({
                message: err
            })
        } else {
            const user = {
            username: request.body.username,
            password: hash,
            email: request.body.email,
            avatar: request.file.path
            }
            const query = "INSERT INTO accounts (username, password, email, avatar) VALUES (?, ?, ?, ?)"
            const values = [user.username, user.password, user.email, user.avatar]
        
            connection.query(query, values, function(error, result){
                if (error){
                    if(error.errno == 1062){
                        response.status(400).json({
                            error: "Username not unique"
                        })
                    } else {
                        response.status(500).json({
                            message: error
                        }).end()
                    }
                } else {
                    response.setHeader("Location", "/accounts/"+user.username)
                    response.status(201).json({
                        message: "User created",
                        user: user
                    }).end()
                }
            })
        }
    })
})

// POST /accounts/login
// Login with valid username
// Body: {"username": "User1", "password": "123"}
router.post('/login', (request, response, next) => {
    const createdUser = {
        username: request.body.username,
        password: request.body.password
    }
    const query = "SELECT * FROM accounts WHERE username = ?"
    const values = [createdUser.username, createdUser.password]
        
    connection.query(query, values, function(error, users){
        const user = users[0]
        if(users.length == 0){
            response.status(400).json({error: "Invalid username"})
            return
        }
        bcrypt.compare(createdUser.password, users[0].password, (err, result) => {
            if (err) {
                if (counter >= 2) {
                    response.status(400).json({
                        message: "Your account is locked. Try again in 1 hour."
                    })
                }
                counter++
                response.status(401).json({
                    message: "Authorization failed",
                }) 
            }
            if (result) { 
                const accessToken = jwt.sign({
                    username: user.username,
                    }, jwtSecret)
                response.setHeader("Location", "/accounts/"+createdUser.username)
                return response.status(200).json({
                    message: "Authorization successful",
                    accessToken: accessToken
                })
            }
            if (counter >= 2) {
                response.status(400).json({
                    message: "Your account is locked. Try again in 1 hour."
                    })
                }
            counter++
            response.status(401).json({
                message: "Authorization failed!",
            })
        })
    })
})

// GET /accounts/:username
// Retrieve a specific username
router.get('/:username', (request, response, next) => {
    const username = request.params.username

    const query = "SELECT username FROM accounts WHERE username = ?"
    const values = [username]

    connection.query(query, values, function(error, users){
        if(error){
            response.status(500).end()
        } else {
            if(username.length == 0){
                response.status(400).json({
                    message: "Invalid username",
                })
            }
            const user = users[0]
            if (user.username == username) {
                response.status(200).json({
                    message: "Successfull request",
                    account: username
                })
            } else {
                response.status(404).json({
                    message: "Username not found"
                })
            }  
        }
    })
})

// PUT /accounts/:username
// Lets the signed in user change profile-avatar
// Body: {"username": "User1", "avatar": "img_123.jpg"}
router.put('/:username', checkAuth, upload.single('avatar'), (request, response, next) => {
    const user = {
        username: request.body.username,
        avatar: request.file.path
    }

    const query = "UPDATE accounts SET avatar = ? WHERE username = ?"
    const values = [user.avatar, user.username]

    connection.query(query, values, function(error, users){
        const user = users[0]
        if(users.length == 0){
            response.status(400).json({error: "Invalid username"})
            return
        }
        if (error) {
            response.status(400).json({
                error: error
            })
        } else {
            response.status(200).json({
                message: "Updated profile!",
                avatar: "New avatar: " + request.file.path
            })
        }
    })
})

// Delete /accounts/:username
// Lets the signed in user delete it's own account
// Body: {"username": "User1"}
router.delete('/:username', checkAuth, (request, response, next) => {
    const user = {
        username: request.body.username,
    }

    const query = "DELETE FROM accounts WHERE username = ?"
    const values = [user.username]

    connection.query(query, values, function(error, users){
        if (error) {
            response.status(400).json({
                error: error
            })
        } else {
            response.status(200).json({
                message: "Deleted account!",
                username: "Deleted user: " + user.username
            })
        }
    })
})
module.exports = router