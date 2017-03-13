/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function () {

    var app = angular.module("TestClient");

    var LoginController = function ($scope, ModalService, Resources, LoginService, EventService, RegisterService) {

        $scope.login = {};
        $scope.login.userName = "";
        $scope.login.password = "";

        /**
         * Sendet die auf der Login-Seite eingegeben Logindaten über den LoginService an das
         * Backend
         */
        $scope.submitLoginData = function () {
            LoginService.submitLoginData($scope.login);
            reset();
        };

        /**
         * Prüft ob Username und Passwort eingebenen wurden. Erst dann wird der Login-Button aktiviert.
         * @returns {boolean} Alle nötigen Eingaben getätigt
         */
        $scope.inputMissing = function () {
            for(var key in $scope.login) {
                if($scope.login.hasOwnProperty(key)) {
                    if($scope.login[key] == '') {
                        return true;
                    }
                }
            }
        };

        /**
         * Prüft ob ein Fehler im Response nach dem Login vorliegt
         * @returns {boolean}: Ein Error-Response liegt vor (true/false)
         */
        $scope.isError = function () {
            return LoginService.isError();
        };

        /**
         * Zeigt die Fehlermeldung (falls vorhanden) für den User aus dem
         * Fehlerobjekt auf der Loginseite an
         */
        $scope.showError = function(){
            return LoginService.showError();
        }

        /**
         * Öffnet das modal_register.html über den ModalService
         */
        $scope.openRegister = function() {
            RegisterService.setEvents(EventService.getEvents());
            ModalService.openModal(Resources.registerModal.id, Resources.registerModal.url, Resources.registerModal.ctrl);
        };

        /**
         * Schließt das modal_register.html über den ModalService
         */
        $scope.closeRegister = function(){
            ModalService.closeCurrentModal(Resources.registerModal.id);
        };

        /**
         * Setzt alle getätigten Eingaben zurück
         */
        var reset = function(){
            for(var key in $scope.login) {
                if($scope.login.hasOwnProperty(key)) {
                    $scope.login[key] = '';
                }
            }
        }
    };

    app.controller("LoginController", LoginController);

}());