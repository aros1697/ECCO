const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "ecco.csoonl718jtn.eu-west-1.rds.amazonaws.com",
    database: "ECCOdatabase",
    user: "ECCO",
    password: "Tksgisopdi7t"
})

connection.query(`CREATE TABLE IF NOT EXISTS accounts (
    username VARCHAR(50) UNIQUE PRIMARY KEY,
    password VARCHAR(100),
    email VARCHAR(100)
    avatar 
)`)

connection.query(`CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contentPost VARCHAR(100),
    accountId INT,
    FOREIGN KEY (username) REFERENCES accounts(username) ON DELETE CASCADE  
)`)

connection.query(`CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contentComments VARCHAR(100),
    accountId INT,    
    FOREIGN KEY (username) REFERENCES accounts(username) ON DELETE CASCADE
    
)`)

connection.query(`CREATE TABLE IF NOT EXISTS privateMessage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contentPM VARCHAR(100),
    accountId INT,
    FOREIGN KEY (username) REFERENCES accounts(username) ON DELETE CASCADE    
)`)

module.exports = connection