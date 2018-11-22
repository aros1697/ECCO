const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./db')
const jwt = require('jsonwebtoken')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const jwtSecret = "jknasbdhbsadvsavdagsdsdvraw"


// POST /accounts
// Content-type: application/json
// Body: {"username": "User1, "password": "Hej123", "email": "example@example.com"}
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

// POST /tokens
// Content-Type: application/x-www-form-urlencoded
// Body: grant_type=password&username=User1&password=Hej123
app.post("/tokens", function(request, response){
	
	const grant_type = request.body.grant_type
	const username = request.body.username
	const password = request.body.password
	
	if(grant_type != "password"){
		response.status(400).json({error: "unsupported_grant_type"})
		return
	}
	
	const query = "SELECT * FROM accounts WHERE username = ?"
	const values = [username]
	
	connection.query(query, values, function(error, users){
		
		if(error){
			response.status(500).end()
		}else{
			
			if(users.length == 0){
				response.status(400).json({error: "invalid_grant"})
				return
			}
			
			const user = users[0]
			
			if(user.password == password){
				// Do login!
				const accessToken = jwt.sign({
					accountId: user.id
				}, jwtSecret)
				const idToken = jwt.sign({
					sub: user.id,
					display_name: user.username
				}, jwtSecret)
				response.status(200).json({
					access_token: accessToken,
					id_token: idToken
				})
			}else{
				response.status(400).json({error: "invalid_grant"})
			}
			
		}
		
	})
	
})

// GET /accounts/login
// Content-type: application/json
// Body: {"username": "User1"}
app.get("/accounts/login", function(request, response){

    const username = request.body.username
})

/*app.post("/accounts/{username}/uploadAvatar", function(request, response){

    // TODO

})*/

// POST /posts
// Content-type: application/json
// Authorization: Bearer the.access.token
// Body: {"id": 123, "username": "User1", "contentPosts": "HejHej"}
app.post("/posts", function(request, response){

    const id = request.body.id
    const username = request.body.username
    const contentPM = request.body.contentPM

    const authorizationHeader = request.header("Authorization")
	
	const accesToken = authorizationHeader.substr("Bearer ".length)
	
	let payload = null
	
	try{
		payload = jwt.verify(accesToken, jwtSecret)
	}catch(e){
		response.status(401).end()
		return
	}
	
	if(payload.accountId != accountId){
		response.status(401).end()
		return
	}

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