const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors')
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// using cors
app.use(cors())

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'srv873.hstgr.io',
    user: 'u109247860_owner',
    password: 'Sury@1729',
    database: 'u109247860_epimax'
});

//Route to create a new user
app.post('/create-user', (req, res) => {
    
    const {fullName, username} = req.body;
    for (let i = 0; i < 50; i++){
        console.log(fullName, username, 'this is data from client')
    }
    console.log(req)
    pool.query('INSERT INTO users (full_name, username) VALUES(?, ?)', [fullName, username], (error, results, fields) => {
        if (error) {
            console.error('Error creating user:', error);
            res.status(500).json({error: 'Failed to create user'});
            return;
        }
        res.json({success: true})
    })
})


// Route to login the user
app.post('/login', (req, res) => {
    
    const {username} = req.body;
    // console.log(req)
    // for (let i = 0; i < 10; i ++){
        
    //     console.log(username, 'this is username')
    // }

    pool.query(`SELECT * FROM user WHERE username = '${username}'`, (error, results, fields) => {
        if (error) {
            console.error('Error creating user:', error);
            res.status(500).json({error: 'Failed to create user'});
            return;
        }
        if (results.length === 0){
            res.status(400).json({error: 'User not found'});
            return; 
        }
        res.json({success: true})
    })
})

// Route to send message data to database
app.post('/send-message', (req, res) => {
    const { sender, receiver, message } = req.body;
    // Insert message into database
    pool.query('INSERT INTO message (sender, receiver, message) VALUES (?, ?, ?)', [sender, receiver, message], (error, results, fields) => {
        if (error) {
            console.error('Error inserting message:', error);
            res.status(500).json({ error: 'Failed to send message' });
            return;
        }
        res.json({ success: true });
    });
});

app.post('/get-message', (req, res) => {
    const {username, time} = req.body
    pool.query(`SELECT message,time FROM message WHERE receiver = '${username}' and time > '${time}' `, (error, results, fields) => {
        if (error) {
            console.error('Error creating user:', error);
            res.status(500).json({error: 'Failed to create user'});
            return;
        }
        let modifiedResults = results.filter(eachResult => eachResult.time > time)
        res.json({success: true, results: modifiedResults})
    })
})


app.post('/get-message-until-latest-time', (req, res) => {
    const {username} = req.body
    pool.query(`SELECT message,time FROM message WHERE receiver = '${username}' `, (error, results, fields) => {
        if (error) {
            console.error('Error creating user:', error);
            res.status(500).json({error: 'Failed to create user'});
            return;
        }
        res.json({success: true, results: results})
    })
})


// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
