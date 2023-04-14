

var http = require('http');
var express = require('express')
var mysql = require('mysql')
var app = express();

// app.use(express.static('public'))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(express.static('public'));
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
    host: 'mysql-120961-0.cloudclusters.net',
    user: 'M6user',
    password: 'qwer/.,m',
    database: 'dbM6',
    port: '16225'
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
            "SELECT * FROM Lottery",
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
        // return res.status(500).send();
        return redirect('your_result_view_name_in_urls', results = results)
    }
})


app.get("/Lottary/:id", async (req, res) => {
    const id = req.params.id; // retrieve the id parameter from the URL path
    try {
        conn.query(
            "SELECT * FROM Lottery WHERE type = ?",
            [id], // pass the id parameter as a query parameter
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



app.get("/image/:username", async (req, res) => {
    const user = req.params.username; // retrieve the id parameter from the URL path
    try {
        conn.query(
            "SELECT * FROM `users` WHERE username = ?",
            [user], // pass the id parameter as a query parameter
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
            "INSERT INTO users(username, password, status) VALUES (?,?,?)", [username, password, PIN],
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

// app.post("/login", async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         conn.query(
//             "SELECT * FROM usercustomer WHERE username = ? AND password = ?", [username, password],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error fetching user");
//                     return res.status(400).send();
//                     // return redirect('your_result_view_name_in_urls', results = res.status(400).send())
//                 }
//                 if (results.length === 0) {
//                     return res.status(401).json({ message: "Invalid username or password", Boolean: false });
//                     // return redirect('your_result_view_name_in_urls', results = res.status(401).json({ message: "Invalid username or password", Boolean: false }))
//                 }
//                 // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
//                 return res.status(200).json({ message: "Login successful", Boolean: true });
//                 // return redirect('your_result_view_name_in_urls', results = res.status(200).json({ message: "Login successful", Boolean: true }))
//             }
//         )
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send();
//         // return redirect('your_result_view_name_in_urls', results = res.status(500).send())
//     }
// });

app.post("/login", urlencodedParser, async (req, res) => {
    console.log("==============login============");
    const { username, password } = req.body;

    try {
        conn.query(
            "SELECT * FROM users WHERE username = ? AND password = ?", [username, password],
            (err, results, fields) => {
                if (err) {
                    console.log("Error fetching user");
                    return res.status(400).send();
                }
                if (results.length === 0) {
                    return res.status(401).json({ message: "Invalid username or password", Boolean: false });
                }
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
            "SELECT * FROM users WHERE username = ?", [username],
            (err, results, fields) => {
                if (err) {
                    console.log("Error fetching user");
                    return res.status(400).send();
                }
                if (results.length === 0) {
                    return res.status(401).json({ message: "Invalid username or password", Boolean: false });
                }
                // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
                return res.status(200).json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format  
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})  

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
// app.listen(3000, () => console.log("Server is runing "));