/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("TestClient");

    var RegisterService = function(ModalService, Resources, SocketService) {

        var events;
        var error = "";
        var socket;

        /**
         * Initializes handlers on the defined socket io events
         */
        var init = function () {
            socket.on(events.register.success, function (response) {
                console.log("Response: " + JSON.stringify(response));
                ModalService.closeCurrentModal(Resources.registerModal.id);
            });

            socket.on(events.register.error, function (response) {
                console.log('register error: ' + JSON.stringify(response));
                error = response.msg;
            })
        };

        var submitRegistrationData = function(data){
            var userData =
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    userName: data.userName,
                    password: data.password,
                    passwordConf: data.passwordConf
                };

            SocketService.connect();
            SocketService.getSocket().on('connect', function(){
                socket = SocketService;
                init();
                socket.emit(events.register.success, userData);
            })
        };


        var isError = function(){
            return error != "";
        };

        var showError = function(){
            return error;
        };

        var setSocket = function(ss) {
            socket = ss;
        }

        var setEvents = function(es) {
            events = es;
        }
        //initOnSocketEvents();

        return {
            isError: isError,
            showError: showError,
            submitRegistrationData: submitRegistrationData,
            setSocket: setSocket,
            init: init,
            setEvents: setEvents
        }
    };

    app.factory("RegisterService", ['ModalService', 'Resources', 'SocketService', RegisterService]);
}());