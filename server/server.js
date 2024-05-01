const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors')
const app = express();
const port = 3000;

const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

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
    
    const {fullname, username} = req.body;
    
    // Check if the username is unique
    pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results, fields) => {
        if (error) {
            console.error('Error checking username uniqueness:', error);
            res.status(500).json({error: 'Failed to check username uniqueness'});
            return;
        }

        if (results.length > 0) {
            // Username already exists
            res.status(400).json({error: 'Username must be unique'});
            return;
        }

        // Username is unique, proceed with user creation
        // Inserting new user into 'users' table
        pool.query('INSERT INTO users (full_name, username) VALUES(?, ?)', [fullname, username], (error, results, fields) => {
            if (error) {
                console.error('Error creating user:', error);
                res.status(500).json({error: 'Failed to create user'});
                return;
            }
            
            // Creating new tables for the user
            const userId = results.insertId;
            createTables(userId, (err) => {
                if (err) {
                    console.error('Error creating tables:', err);
                    res.status(500).json({error: 'Failed to create tables'});
                    return;
                }
                
                // Generate JWT token
                const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' }); // Adjust expiration time as needed
                
                // Send token as response
                res.json({ success: true, token });
            });
        });
    });
});


function createTables(userId, callback) {
    const sectionsTable = `sections_${userId}`;
    const tasksTable = `tasks_${userId}`;
    const myTasksTable = `mytasks_${userId}`;

    // Creating sections table
    const createSectionsTableQuery = `CREATE TABLE ${sectionsTable} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_name TEXT
    )`;

    // Creating tasks table
    const createTasksTableQuery = `CREATE TABLE ${tasksTable} (
        task_id INT AUTO_INCREMENT PRIMARY KEY,
        section_id INT,
        task_name TEXT,
        assignee VARCHAR(255),
        priority VARCHAR(255),
        FOREIGN KEY (section_id) REFERENCES ${sectionsTable}(id)
    )`;

    // Creating myTasks table
    const createMyTasksTableQuery = `CREATE TABLE ${myTasksTable} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        FOREIGN KEY (task_id) REFERENCES ${tasksTable}(task_id)
    )`;

    // Inserting initial data into sections table
    const insertSectionsDataQuery = `INSERT INTO ${sectionsTable} (section_name) VALUES ?`;
    const sectionsData = [
        ['To Do'],
        ['Doing'],
        ['Done']
    ];

    // Executing queries to create tables and insert initial data
    pool.query(createSectionsTableQuery, (err1, results1) => {
        if (err1) {
            callback(err1);
            return;
        }
        pool.query(createTasksTableQuery, (err2, results2) => {
            if (err2) {
                callback(err2);
                return;
            }
            pool.query(createMyTasksTableQuery, (err3, results3) => {
                if (err3) {
                    callback(err3);
                    return;
                }
                pool.query(insertSectionsDataQuery, [sectionsData], (err4, results4) => {
                    if (err4) {
                        callback(err4);
                        return;
                    }
                    callback(null); // Tables created and data inserted successfully
                });
            });
        });
    });
}


// Route to login the user
app.post('/login', (req, res) => {
    
    const {username} = req.body;
    

    pool.query(`SELECT * FROM users WHERE username = '${username}'`, (error, results, fields) => {
        if (error) {
            console.error('Error finding user:', error);
            res.status(500).json({error: 'Failed to find user'});
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
