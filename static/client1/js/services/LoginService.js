/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("TestClient");

    var LoginService = function(
        SocketService, EventService,
        ContentService, LogoutService,
        MessageService, RegisterService,
        OverviewService, jwtHelper, $location) {


        var events = EventService.getEvents();
        var error = "";
        var socket;

        var initServices = function(){
            OverviewService.setSocket(socket);
            OverviewService.setEvents(events);
            OverviewService.init();
            ContentService.setSocket(socket);
            ContentService.setEvents(events);
            ContentService.init();
            LogoutService.setSocket(socket);
            LogoutService.setEvents(events);
            LogoutService.init();
            MessageService.setSocket(socket);
            MessageService.setEvents(events);
            MessageService.init();
            RegisterService.setSocket(socket);
            RegisterService.setEvents(events);
        }

        /**
         * Initializes handlers on the defined socket io events
         */
        var init = function () {
            socket.on(events.login.success, function (response) {
                localStorage.setItem('token', response);
                let usrData = jwtHelper.decodeToken(response);
                console.log("FETCHED USER DATA: " + JSON.stringify(usrData));
                localStorage.setItem('user', JSON.stringify(usrData));
                console.log('decoded: ' + JSON.stringify(usrData));
                console.log("returned token: " + localStorage.getItem('token'));
                error = '';
                initServices();
                $location.path("/overview");
            });

            socket.on(events.login.error, function(response) {
                console.log('login error: ' + JSON.stringify(response));
                localStorage.clear();
                error = response.msg;
            });
        };

        var submitLoginData = function(data) {
            var loginData =
                {
                    userName: data.userName,
                    password: data.password
                };

            SocketService.connect();
            SocketService.getSocket().on('connect', function(){
                console.log("connected");
                socket = SocketService;
                init();
                socket.emit(events.login.success, loginData);
            })
        };


        var isError = function(){
            return error != "";
        };

        var showError = function(){
            return error;
        };

        return {
            submitLoginData: submitLoginData,
            isError: isError,
            showError: showError
        }

    };

    app.factory("LoginService", ['SocketService', 'EventService',
        'ContentService', 'LogoutService',
        'MessageService', 'RegisterService',
        'OverviewService', 'jwtHelper', '$location', LoginService]);
}());