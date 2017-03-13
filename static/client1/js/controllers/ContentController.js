/**
 * @Author: Jan Dieckhoff
 * Der zugehörige Controller zur modal_create_content.html, modal_delete_content.html, modal_edit_content.html
 */

(function () {

    var app = angular.module("TestClient");

    var ContentController = function ($scope, ContentService, ModalService,Resources) {

        $scope.htmlContent = "";

        /**
         * Schließt das modal_create_content.html über den ModalService
         */
        $scope.closeContentModal = function(){
            ModalService.closeCurrentModal(Resources.contentModal.id);
        };

        /**
         * Schließt das modal_edit_content.html über den ModalService
         */
        $scope.closeContentEditModal = function() {
            ModalService.closeCurrentModal(Resources.contentEditModal.id);
        };

        /**
         * Schließt das modal_delete_content.html über den ModalService
         */
        $scope.closeContentDeleteModal = function() {
            ModalService.closeCurrentModal(Resources.contentDeleteModal.id);
        };

        /**
         * Sendet den erzeugten Content im WYSIWYG-Editor über den ContentService
         * an das Snap! - Backend
         * @param {String} htmlContent: Der übergeben HTML-Content als String
         */
        $scope.submit = function(htmlContent){
            ContentService.submit(htmlContent);
            ModalService.closeCurrentModal(Resources.contentModal.id);
        };

        /**
         * Lädt einen HTML-Content-String in den WYSIWYG-Editor
         */
        $scope.getCurrHtmlContent = function(){
            return ContentService.getCurrHtmlContent();
        };
    };
    app.controller("ContentController", ContentController);
}());