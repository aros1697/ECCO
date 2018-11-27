// Checks if user is logged in

const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, jwtSecret)
        request.userData = decoded
        next()
    } catch (error) {
        response.status(401).json({
            message: "Authorization failed"
        })
    }
}