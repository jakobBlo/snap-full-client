let io = require('socket.io')();
let count = 1
let clients = {}

io.on('connection', function (socket) {
    let socketId = socket.id
    let user = {userName: 'user' + count, socketId: socketId}
    clients['user' + count] = socket
    count++

    socket.on('clients', () => {
        let arr = []
        for (let prop in clients) {
            if (clients.hasOwnProperty(prop)) {
                if(prop != user.userName) {
                    arr.push({userName: prop})
                }
            }
        }
        socket.emit('clients', arr)
    })

    socket.emit('connection', user)
    socket.broadcast.emit('user_connected', user)
})

io.listen(3003)