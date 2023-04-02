var http = require('http');
const express = require('express')
const mysql = require('mysql')
const app = express();
// var cors = require('cors');
// app.use(cors());

const conn = mysql.createConnection({
    host: 'mysql-119174-0.cloudclusters.net',
    user: 'useM6',
    password: 'qwer/.,m',
    database: 'dbM6',
    port: '19978'
})

conn.connect((err) => {
    if (err) {
        console.log("Error connecion to Mysql ")
        return;
    }
    console.log("My sql Success")
});
// Routes
app.get('/', function (req, res, next) {
    res.render('index', { title: 'Express', session: req.session });
});

app.get("/Testget", (ruq, res, next) => {
    res.json(["Max", "A", "qweqwe", "asdasd"]);
});

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

app.post('/login', function (request, response, next) {

    var user_email_address = request.body.username;

    var user_password = request.body.password;

    if (user_email_address && user_password) {
        query = `
        SELECT * FROM usercustomer 
        WHERE username = "${user_email_address}"
        `;

        conn.query(query, function (error, data) {

            if (data.length > 0) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].password == user_password) {
                        request.session.username = data[count].username;
                        response.redirect("/");
                    }
                    else {
                        response.send('Incorrect Password');
                    }
                }
            }
            else {
                response.send('Incorrect Email Address');
            }
            response.end();
        });
    }
    else {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }

});


app.post("/logins", async (req, res) => {
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

app.get("/read/user/:username", async (req, res) => {
    const username = req.params.username;
    try {
        conn.query(
            "SELECT * FROM usercustomer WHERE username = ?",
            [username],
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



// http.createServer(function (req, res) {
//     console.log(`Just got a request at ${req.url}!`)
//     res.write('API M6!');
//     res.end();
// }).listen(process.env.PORT || 3000);

app.listen(3000, () => console.log("Server is runing "));
