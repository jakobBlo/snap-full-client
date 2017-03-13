/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("TestClient");

    var ModalService = function($modal) {

        var modalInstances = {};

        var openModal = function(identifier, templateUrl, controller) {

            modalInstances[identifier] = $modal.open({
                templateUrl: templateUrl,
                controller: controller,
            })
            console.log(JSON.stringify(modalInstances))
        };

        var closeCurrentModal = function(identifier) {

            modalInstances[identifier].close();
            modalInstances[identifier] = null;
        };

        var getModalInstance = function(identifier){
            return modalInstances[identifier];
        };

        return {
            openModal: openModal,
            closeCurrentModal: closeCurrentModal,
            getModalInstance: getModalInstance
        }

    };

    app.factory("ModalService", ['$modal', ModalService]);
}());