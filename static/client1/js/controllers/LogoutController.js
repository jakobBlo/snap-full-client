/**
 * @Author: Jan Dieckhoff
 * Controller für den Logout-Button auf der UI
 */

(function () {

    var app = angular.module("TestClient");

    var LogoutController = function ($scope, $window, SocketService, LogoutService) {

        /**
         * Loggt den angemeldet User aus und sendet dabei ein entsprechendes Event
         * mit den von der Snap-API benötigten Daten an das Backend
         */
        $scope.logout = function () {
            LogoutService.logout();
        }
    };

    app.controller("LogoutController", LogoutController);

}());