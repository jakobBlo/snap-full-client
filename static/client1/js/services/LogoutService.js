/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("TestClient");

    var LogoutService = function($location) {

        var events;
        var socket;

        /**
         * Initializes handlers on the defined socket io events
         */
        var init = function () {

            socket.on(events.logout.success, function (response) {
                console.log("on logout: " + JSON.stringify(response));
                localStorage.clear();
                $location.path('/');
            });

            socket.on(events.logout.error, function (response) {
                // TODO: give any feedback on error
                console.log('logout error: ' + JSON.stringify(response))
            })
        }

        var logout = function(){
            var data = {token: localStorage.getItem('token'), payload: {}};
            socket.emit(events.logout.success, data);
        }

        var setSocket = function(ss) {
            socket = ss;
        }

        var setEvents = function(es) {
            events = es
        }

        //initOnSocketEvents();

        return {
            setSocket: setSocket,
            logout: logout,
            init: init,
            setEvents: setEvents
        }

    };

    app.factory("LogoutService", ['$location',LogoutService]);
}());