const path = require("path");
const debug_log = require("debug")("iot:express");
const express = require('express'); 
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

const cors = require('cors');
const app = express();


require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

app.set('trust proxy', true);
app.use(cors());

app.use(bodyParser.json({limit: "1mb", type:["text/*", "*/json"]}));
app.use(bodyParser.urlencoded({limit: "1mb", extended: true, parameterLimit:20}))


// Front end access to serve from server nodejs
app.use(express.static(path.join(__dirname, 'views')))


app.use("/admin", apiRouter)
app.use("/restapi/iot", apiRouter)
app.use("/home", (req, res) => res.send("ok"))

app.listen({
        host: process.env.SERVER_IP, 
        port: process.env.SERVER_PORT
    }, function() { 
        //server to localhost:8080
    debug_log(`Server started listening on port ${ process.env.SERVER_IP} and IP ${process.env.SERVER_PORT}`)
})


// put front end routes at last
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

  
process.on('uncaughtException', (err, origin) => {
    debug_log(`Global Exception Handling at errors.js, error is : ${err},
        origin is ${origin}, stack: ${err.stack}`)
});


process.on('unhandledRejection', (reason, p) => {
    //call handler here
    debug_log(`Global Unrejected Promise Exception Handling at dev.js, 
        error is : ${reason}, promise is ${p}` );
});
