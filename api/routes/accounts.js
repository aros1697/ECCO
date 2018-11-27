const express = require('express')
const router = express.Router()
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const connection = require('../../db')

const jwtSecret = "jknasbdhbsadvsavdagsdsdvraw"

// save uploads in folder /avatars and name it to the original filename
const storage = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, './avatars/')
    },
    filename: function(request, file, callback) {
        callback(null, file.originalname)
    }
})

// only accept jpegs and pngs, reject other files
const fileFilter = (request, file, callback) => {
    if (file.mimetype === image/jpeg || file.mimetype === image/png) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

// accept only images up to 5mb
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFiler: fileFilter
})

// Fetch a list with user-accounts
router.get('/', (request, response, next) => {
    response.status(200).json({
        message: "User-accounts was fetched"
    })
})

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
                        response.status(400).json({error: "Username not Unique"})
                    } else {
                        response.status(500).json({
                            message: error
                        }).end()
                    }
                } else {
                    const username = result.insertUsername
                    
                    response.setHeader("Location", "/accounts/"+username)
                    response.status(201).json({
                        message: "User created",
                        user: user
                    }).end()
                }
            })
        }
    })
})

router.post('/login', (request, response, next) => {
    const user = {
        username: request.body.username,
        password: request.body.password
        }

    bcrypt.compare(user.password, user[0].password, (err, result) => {
        if (err) {
            response.status(401).json({
                message: "Authorization failed"
            })
        }

        const query = "SELECT * FROM accounts WHERE username = ?"
        const values = [username]
        
        connection.query(query, values, function(error, users){
            if (error) {
                response.status(500).end()
            } else {
                if(users.length == 0){
                    response.status(400).json({error: "invalid_grant"})
                    return
                }
                const user = user[0]
                if (user.password === password){
                    const accessToken = jwt.sign({
                        username: user.username,
                    }, jwtSecret,
                    {
                        expiresIn: "1h"
                    }
                    )
                    response.status(200).json({
                        message: "Authorization successful",
                        accessToken: accessToken
                    })
                }
                response.status(401).json({
                    message: "Authorization failed"
                })
            }
        })
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

router.put('/:username', checkAuth, (request, response, next) => {
    response.status(200).json({
        message: "Updated profile!"
    })
})

router.delete('/:username', checkAuth, (request, response, next) => {
    response.status(200).json({
        message: "Deleted account!"
    })
})
module.exports = router