
/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("TestClient");

    var SocketService = function($rootScope) {

        var local = true;
        var host = local ? 'localhost:3000' : 'jd-hh.de';
        var protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
        var path = location.protocol === 'https:' ? {path: '/secure'} : {path: ''};
        var socket;

        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },
            connect: function(){
                socket = io(protocol + host, path);
            },
            getSocket: function(){
                return socket;
            }
        }
    };

    app.factory("SocketService", ['$rootScope', SocketService]);
}());
