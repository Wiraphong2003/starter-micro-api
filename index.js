
const fs = require('fs')
var http = require('http');
var express = require('express')
var mysql = require('mysql')
var cors = require('cors')
var app = express();
const textToImage = require('text-to-image');
const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
const { log } = require('console');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(express.static('public'));
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))


var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Accept,Accept- Language, Content - Language, Content - Type');
    next();
});
app.use(cors())


app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.setHeader('Access-Control-Allow-Headers', 'Accept,Accept- Language, Content - Language, Content - Type');
    next();
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', "Content-Type");
    res.setHeader('Access-Control-Allow-Headers', 'Accept,Accept- Language, Content - Language, Content - Type');
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

app.get("/read", async (req, res,) => {
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
app.get("/CreateImage/:id", (req, res) => {
    const id = req.params.id;
    try {
        conn.query(
            "SELECT * FROM users WHERE username = ?",
            [id], // pass the id parameter as a query parameter
            (err, results, fields) => {
                console.log(results);
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                const { loadImage, createCanvas } = require("canvas");
                const width = 800;
                const height = 800;
                const canvas = createCanvas(width, height);
                const context = canvas.getContext("2d");
                context.fillStyle = "#2b03a3";
                context.fillRect(0, 0, width, height);
                context.font = "bold 72pt Menlo";
                context.textBaseline = "top";
                context.textAlign = "center";
                context.fillStyle = "#f7ab07";
                const imgText = "Max M6";
                const textAlign = context.measureText(imgText).width;
                context.fillRect(
                    590 - textAlign / 2 - 10,
                    170 - 5,
                    textAlign + 20,
                    120
                );
                context.fillStyle = "#ffffff";
                context.fillText(imgText, 555, 120);
                context.fillStyle = "#ffffff";
                context.font = "bold 32pt Menlo";
                context.fillText("positronx.io", 755, 600);
                console.log(results.img1);
                loadImage(results.img1).then((data) => {
                    context.drawImage(data, 340, 515, 70, 70);
                    const imgBuffer = canvas.toBuffer("image/png");
                    // Send the image file as a response
                    res.type("png").send(imgBuffer);
                });
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});



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
    const { username, password, status, img } = req.body;
    try {
        conn.query(
            "INSERT INTO users(username, password, status,img1) VALUES (?,?,?,?)", [username, password, status, img],
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

app.post("/login", urlencodedParser, cors(corsOptions), function (req, res) {
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

var server = app.listen(PORT, () => {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
// app.listen(3000, () => console.log("Server is runing "));