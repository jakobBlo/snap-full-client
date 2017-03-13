/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("ChatTest");

    var SocketService = function($rootScope) {

        var socket = io('ws://localhost:3003');
        //var socket = io('ws://46.101.246.10:3004');


        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            getSocket: function(){
                return socket;
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

        }
    };

    app.factory("SocketService", ['$rootScope', SocketService]);
}());