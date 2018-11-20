const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./db')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


// POST /accounts
// Content-type: application/json
// Body: {"username": "Anton", "password": "Hej123", "email": "example@example.com"}
app.post("/accounts", function(request, response){

    const username = request.body.username
    const password = request.body.password
    const email = request.body.email

    const query = "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)"
    const values = [username, password, email]

    connection.query(query, values, function(error, result){
        if (error){
            if(error.errno == 1062){
                response.status(400).json({error: "Username not Unique"})
            } else {
                response.status(500).end()
            }
        } else {
            const username = result.insertUsername
            
            response.setHeader("Location", "/accounts/"+username)
            response.status(201).end()
        }
    })
})

// GET /accounts/login
// Content-type: application/json
// Body: {"username": "Anton"}
app.get("/accounts/login", function(request, response){

    const username = request.body.username
})

/*app.post("/accounts/{username}/uploadAvatar", function(request, response){

    // TODO

})*/

// POST /posts
// Content-type: application/json
// Body: {"id": 123, "username": "ANTON", "contentPM": "HejHej"}
app.post("/posts", function(request, response){

    const id = request.body.id
    const username = request.body.username
    const contentPM = request.body.contentPM

    const query = "INSERT INTO posts (id, username, contentPM) VALUES (?, ?, ?)"
    const values = [id, username, contentPM]

    connection.query(query, values, function(error, response){
        if(error){
            response.status(500).end()
        } else {
            const id = result.insertId

            response.setHeader("Location", "/posts/"+id)
            response.status(204).end()
        }
    })
})

app.listen(8080)