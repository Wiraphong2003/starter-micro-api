var http = require('http');
const express = require('express')
const mysql = require('mysql')
const app = express();
app.use(express.json())



app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    // res.header('Access-Control-Allow-Origin', "http://localhost:4200");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', "Content-Type");
    next();
})


const conn = mysql.createConnection({
    host: 'mysql-119174-0.cloudclusters.net',
    user: 'useM6',
    password: 'qwer/.,m',
    database: 'dbM6',
    port: '19978'
})
// http.createServer(function (req, res) {
//     console.log(`Just got a request at ${req.url}!`)
//     res.write('M6 API YO');
//     res.end();
// })

conn.connect((err) => {
    if (err) {
        console.log("Error connecion to Mysql ")
        return;
    }
    console.log("My sql Success")
});

// app.get('/', function (req, res, next) {
//     res.render('index', { title: 'Express', session: req.session });
// });

app.get("/read", async (req, res) => {
    try {
        conn.query(
            "SELECT * FROM usercustomer",
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results)
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

app.post("/create", async (req, res) => {
    const { username, password, PIN } = req.body;
    try {
        conn.query(
            "INSERT INTO usercustomer(username, password, PIN) VALUES (?,?,?)", [username, password, PIN],
            (err, results, fields) => {
                if (err) {
                    console.log("Error inert");
                    return res.status(400).send();
                }
                return res.status(201).json({ messge: "New username Suuccess" })
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        conn.query(
            "SELECT * FROM usercustomer WHERE username = ? AND password = ?", [username, password],
            (err, results, fields) => {
                if (err) {
                    console.log("Error fetching user");
                    return res.status(400).send();
                }
                if (results.length === 0) {
                    return res.status(401).json({ message: "Invalid username or password", Boolean: false });
                }
                // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
                return res.status(200).json({ message: "Login successful", Boolean: true });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});


app.post("/users", async (req, res) => {
    const { username } = req.body;

    try {
        conn.query(
            "SELECT * FROM usercustomer WHERE username = ?", [username],
            (err, results, fields) => {
                if (err) {
                    console.log("Error fetching user");
                    return res.status(400).send();
                }
                if (results.length === 0) {
                    return res.status(401).json({ message: "Invalid username or password", Boolean: false });
                }
                // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
                return res.status(200).json({ message: "Login successful", Boolean: true });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});



app.listen(3000, () => console.log("Server is runing "));