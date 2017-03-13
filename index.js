"use strict"
let io = require("socket.io")()
let config = require("./config/apiConfig")
    .config
let events = require("./config/eventConfig")
    .config

let express = require('express')
let peer = require('peer')
let app = express()
let srv = app.listen(3001)

////////// snap
let snap = require('oh.snap').init({
    "type": "mongodb",
    "host": "mongodb://127.0.0.1:27017/",
    "dataStore": "test",
    "login": "",
    "password": ""
})


/**
 * Whenever someone connects this gets executed
 * Every Request-Event needs an object {token: <client_jwt>, payload: <any_valid_json_obj>}, except 'login and 'register'
 * Authentification with token on every request
 * token and payload attributes are obligatory
 */

io.sockets.on('connection', function (socket) {
    console.log("SOCKET OONNECTED: " + socket.id)

    socket.on(events.login.success, (loginData) => snap.users.login(loginData, (error, response) => {
        console.log("Client with Socket-ID: " + socket.id + " has connected")
        if (error) {
            socket.emit(events.login.error, error)
        } else {
            addSocket(response._id, socket.id)
            socket.emit(events.login.success, response.token)

            sendResponse(response.token, events.user_login.success, {online: true}, socket, {
                _id: response._id,
                userName: response.userName,
                online: true
            });
        }
    }))

    socket.on(events.register.success, (registerData) => snap.users.register(registerData, ["default"], (error, response) => {

        if (error) {
            socket.emit(events.register.error, error)
        } else {
            socket.emit(events.register.success, response)
            socket.disconnect(); // Needed to get clean connection, when login after registration
        }
    }))

    socket.on(events.online_users.success, (data) => snap.users.get(data.token, {"online": true}, ["default"], (error, response) => {
        if (error) {
            socket.emit(events.online_users.error, error)
        } else {
            socket.emit(events.online_users.success, response)
        }
    }))

    socket.on(events.all_users.success, (data) => snap.users.get(data.token, {}, ["default"], (error, response) => {
        if (error) {
            socket.emit(events.all_users.error, error)
        } else {
            socket.emit(events.all_users.success, response)
        }
    }))

    socket.on(events.spec_user.success, (data) => snap.users.get(data.token, data.payload, ["default"], (error, response) => {

        if (error) {
            socket.emit(events.spec_user.error, error)
        } else {
            console.log("EMITTING SPEC USER: " + JSON.stringify(response))
            socket.emit(events.spec_user.success, response)
        }
    }))

    // Issue #17: Connection/Follow Funktion im User-Modul
    socket.on(events.follow.success, (data) => snap.users.connect(data.token, data.payload.userIdFrom, data.payload.userIdTo, (error, response) => {

        if (error) {
            socket.emit(events.follow.error, error)
        } else {
            console.log("FOLLOW RESPONSE: " + JSON.stringify(response))
            socket.emit(events.follow.success, response)

           // let userInfo = snap.users.authenticate(data.token)
            console.log("FROM USER: " + JSON.stringify(data.payload.userIdFrom))
            socket.broadcast.to(getSocket(response._id)).emit(events.followedBy.success, data.payload.userIdFrom)

            //SEND CONTENT OF FREH FOLLOWED USER
            response.content.forEach(id => {
                snap.content.get(data.token, {"_id": id.content_id}, ["default"], (error, content) => {
                    if(error) {
                        // Nothing
                    } else {
                        socket.emit(events.load_content.success, content)
                    }
                })
            })
        }
    }))

    socket.on(events.unfollow.success, (data) => snap.users.disconnect(data.token, data.payload.userIdFrom, data.payload.userIdTo, (error, response) => {

        if (error) {
            socket.emit(events.unfollow.error, error)
        } else {
            socket.emit(events.unfollow.success, response)
            //let userInfo = snap.users.authenticate(data.token, ["default"])
            socket.broadcast.to(getSocket(response._id)).emit(events.unFollowedBy.success, data.payload.userIdFrom)
        }
    }))

    socket.on(events.logout.success, (data) => snap.users.logout(data.token, (error, response) => {

        if (error) {
            socket.emit(events.logout.error, error)
        } else {
            socket.emit(events.logout.success, response)
            sendResponse(data.token, events.user_logout.success, {online: true}, socket, {
                _id: response._id,
                userName: response.userName,
                online: true
            })

            removeSocket(response._id)
            socket.disconnect()
            console.log("DISCONNECTED FROM SOCKET: " + response._id)
        }
    }))

    socket.on(events.save_content.success, (data) => {
        snap.content.create(data.token, data.payload, ["default"], (error, savedContent) => {
            let response
            if (error) {
                response = error
            } else {
                response = savedContent
            }
            socket.emit(events.save_content.success, response)

            // Issue 42: Content nach erzeugung an alle Follower schicken
            let decoded = snap.users.authenticate(data.token, ["default"])
            snap.users.get(data.token, {"_id": decoded._id}, ["default"], (error, user) => {
                if (error) {
                    console.log(error)
                } else {
                    let followedBy = user[0].followedl
                    followedBy.forEach(elem => {
                        socket.broadcast.to(getSocket(elem.from)).emit(events.user_save_content.success, response)
                    })
                }
            })
        })
    })

    socket.on(events.load_content.success, (data) => {

        console.log("RECEIVED ON LOAD CONTENT: " + JSON.stringify(data));
        snap.content.get(data.token, {"_id": data.payload._id}, ["default"], (error, loadedContent) => {
            console.log("LOADED CONTENT: " + JSON.stringify(loadedContent) + " FOR " + data.payload._id)
            let response
            if (error) {
                response = error
            } else {
                response = loadedContent
            }
            console.log("LOADED CONTENT: " + JSON.stringify(response))
            socket.emit(events.load_content.success, response)
        })
    })


    socket.on(events.update_content, (data) => {

        snap.content.update(data.token, data.payload, ["default"], (error, updatedContent) => {
            let response
            if (error) {
                response = error
            } else {
                response = updatedContent
            }
            socket.emit(events.update_content.success, response)

            // Issue 44: updated Content an alle User Follower schicken
            let decoded = snap.users.authenticate(data.token, ["default"])
            snap.users.get(data.token, {"_id": decoded._id}, ["default"], (error, user) => {
                if (error) {
                    console.log(error)
                } else {
                    let followedBy = user[0].followedl
                    followedBy.forEach(elem => {
                        socket.broadcast.to(getSocket(elem.from)).emit(events.user_update_content.success, response)
                    })
                }
            })
        })
    })
})

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

io.listen(3000, function () {
    console.log("starting Server with following configuration: " + JSON.stringify(config))
})


////// User socket Verwaltung
let userSockets = {}

function addSocket(userID, socketID) {
    userSockets[userID] = socketID
    console.log("Added Socket: " + getSocket(userID))
    return getSocket(userID)
}

function removeSocket(userID) {
    let socketID = getSocket(userID)
    if (userSockets.hasOwnProperty(userID)) {
        delete userSockets[userID]
    }
    console.log("Removed Socket: " + socketID)
    return socketID
}

function getSocket(userID) {
    return userSockets[userID]
}

/**
 * Sends a response to a specified set of users
 * @param event the event
 * @param filter  filters the wanted users
 * @param socket
 * @param response
 */
function sendResponse(authToken, event, filter, socket, response) {
    snap.users.get(authToken, filter, ["default"], (error, resp) => {
        if (resp) {
            resp.forEach(user => {
                socket.broadcast.to(getSocket(user._id)).emit(event, response)
            })
        }
    })
}
