let express = require('express')
let app = express()

// … Configure Express, and register necessary route handlers
srv = app.listen(3004)

app.use(express.static(__dirname + "/js"))
app.use(express.static(__dirname + "/frontend"))

app.use('/peerjs', require('peer').ExpressPeerServer(srv, {
    debug: true
}))

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/frontend/chat.html");
});