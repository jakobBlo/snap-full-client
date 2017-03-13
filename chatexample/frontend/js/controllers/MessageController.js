/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function () {

    var app = angular.module("ChatTest");

    var MessageController = function ($scope, SocketService) {

        $scope.clients = [];
        $scope.messages = [];
        $scope.currMessage = "";
        $scope.userName = "";

        var signaled = false;
        var peer;
        var aPeer;
        var send;

        SocketService.emit('clients');

        SocketService.on('clients', function(clients) {
            $scope.clients = clients;
        });

        SocketService.on('user_connected', function(user){
            $scope.clients.push(user)
        })

        SocketService.on('connection', function(response) {
            $scope.userName = response.userName;
            localStorage.setItem('user', JSON.stringify(response))
            //var host = "46.101.246.10";
            var host = "localhost";
            peer = new Peer(response.userName, {
                host: host,
                port: 3004 || (location.protocol === 'https:' ? 443 : 80),
                path: '/peerjs',
                debug: true,
                config: {'iceServers': [
                    { url: 'stun:stun.l.google.com:19302' },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    }
                ]}
            });

            peer.on('connection', function(conn) {
                //send = conn;
                aPeer = conn.peer;
                console.log('connection to: ' + conn.peer);
                conn.on('data', function(data) {
                    console.log('Received', data);
                    var msg = data.userName + ": " + data.msg + "\r\n";
                    $scope.$apply(function(){
                        $scope.messages.push(msg);
                    })
                });
            })
        });



        // Send messages
        $scope.signal = function(userName, debug) {
            signaled = true;
            console.log('signal fired');
            send = peer.connect(userName);
            if(debug) {
                var msg = "SERVER: WebRTC connection to " + userName + " established";
                $scope.messages.push(msg);
                $scope.messages.push("");
            }
            return send;
        };

        $scope.send = function() {
            var msg = {userName: $scope.userName, msg: $scope.currMessage};
            if(!signaled) {
                send = $scope.signal(aPeer, false);
                send.on('open', function(){
                    send.send(msg);
                });
                signaled = true;
            } else {
                send.send(msg);
            }
            $scope.messages.push($scope.userName + ": " + $scope.currMessage);
            $scope.currMessage = "";
        };
    };

    app.controller("MessageController", MessageController);

}());