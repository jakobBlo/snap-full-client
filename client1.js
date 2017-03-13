/**
 * Standalone client-server
 * @Author: Jan Dieckhoff
 */
var express = require('express')
var peer = require('peer')
var app = express()
var srv = app.listen(3000)

app.use(express.static(__dirname + "/static"))
app.use(express.static(__dirname + "/static/client1"))
// app.use(express.static(__dirname + "/static/client1/html"))
// app.use(express.static(__dirname + "/static/client1/css"))
// app.use(express.static(__dirname + "/static/client1/js"))

app.use('/peerjs', peer.ExpressPeerServer(srv, {
    debug: true
}))

app.get('*', function (req, res) {
    res.sendFile(__dirname + "/static/client1/html/index.html")
})





// app.get('/overview', function(req, res) {
//     res.sendFile(__dirname + "/static/client1/html/overview.html")
// })
