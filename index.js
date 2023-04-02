var http = require('http');
const express = require('express')
const mysql = require('mysql')
const app = express();
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
// }).listen(process.env.PORT || 3000);
conn.connect((err) => {
    if (err) {
        console.log("Error connecion to Mysql ")
        return;
    }
    console.log("My sql Success")
});
app.get('/', function (req, res, next) {
    res.render('index', { title: 'Express', session: req.session });
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
app.listen(3000, () => console.log("Server is runing "));