const express = require('express')
const router = express.Router()
const multer = require('multer')
const bcrypt = require('bcrypt')

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
            response.status(201).json({
                message: "Account was created",
                createdUser: user
            })
        }
    })
})

router.post('/login', (request, response, next) => {
    
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