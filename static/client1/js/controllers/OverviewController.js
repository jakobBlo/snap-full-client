/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function () {

    var app = angular.module("TestClient");

    var OverviewController = function ($scope, OverviewService, MessageService, ContentService, ModalService, Resources) {

       // $scope.currentContent = {};

        /**
         * Holt die Liste der ermittelten User die online sind vom OverviewService
         * @returns {Array}: Liste aller eingeloggten User
         */
        $scope.getOnlineUsers = function () {
            return OverviewService.getOnlineUsers();
        };

        /**
         * Holt die Liste der ermittelten User denen vom gerade eingeloggten User gefolgt wird
         * vom OverviewService
         * @returns {Array}: Liste aller User denen gefolgt wird.
         */
        $scope.getFollowing = function () {
            return OverviewService.getFollowing();
        };

        /**
         * Setzt einen Followrequest über den OverviewService an das Snap!-Backend
         * ab
         * @param {Integer} index: Der Index des Users in der übergebenen Liste
         * @param {Array} list: Die Userliste in der sich der User dem gefolgt werden soll befindet.
         */
        $scope.follow = function (index, list) {
            OverviewService.follow(index, list);
        };

        /**
         * Setzt einen Unfollowrequest über den OverviewService an das Snap!-Backend
         * ab
         * @param {Integer} index: Der Index des Users in der übergebenen Liste
         * @param {Array} list: Die Userliste in der sich der User dem gefolgt werden soll befindet.
         */
        $scope.unfollow = function (index, list) {
            OverviewService.unfollow(index, list);
        };

        /**
         * Initialisert einen Chat zu einem User dem gefolgt wird
         * Dafür wird zunächst der bereits vorhandene Chatcontent geladen über den MessageService geladen
         * aus dem Backend geladen und nach Öffnen des
         * modal_chat.html angezeigt.
         * @param anotherUser: Der User zu dem der Chat aufgebaut werden soll
         */
        $scope.message = function (anotherUser) {
            console.log("SET PARTNER: " + JSON.stringify(anotherUser));
            MessageService.setPartner(anotherUser._id);
            MessageService.loadChatContent();
            ModalService.openModal(Resources.chatModal.id, Resources.chatModal.url, Resources.chatModal.ctrl);
        };

        /**
         * Öffnet dss modal_create_content.html
         */
        $scope.openContentModal = function(){
            ModalService.openModal(Resources.contentModal.id, Resources.contentModal.url, Resources.contentModal.ctrl);
        };

        /**
         * Öffnet dss modal_edit_content.html
         */
        $scope.openUpdateContentModal = function(){
            ModalService.openModal(Resources.contentEditModal.id, Resources.contentEditModal.url, Resources.contentEditModal.ctrl);
        };

        /**
         * Öffnet dss modal_delete_content.html
         */
        $scope.openDeleteContentModal = function() {
            ModalService.openModal(Resources.contentDeleteModal.id, Resources.contentDeleteModal.url, Resources.contentDeleteModal.ctrl);
        };

        /**
         * Lädt den HTML-Content der editiert werden soll in den WYSIWYG-Editor
         * @param {Integer} index: Der Index des Contents aus der Liste, die auf
         * der UI angezeigt wird.
         */
        $scope.parseContent = function (index) {
            ContentService.parseContent(index)
        };

        /**
         * Gibt die Liste mit dem ermittelten Content zurück, damit diese
         * auf der UI angezeigt werden kann.
         */
        $scope.getAllContent = function(){
            return ContentService.getAllContent();
        }
    };
    app.controller("OverviewController", OverviewController);
}());