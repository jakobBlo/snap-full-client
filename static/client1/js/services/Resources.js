/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("TestClient");

    var Resources = function() {

        return {
            registerModal: {id:'register', url:'../../html/modal/modal_register.html', ctrl: 'RegisterController'},
            contentModal: {id: 'content', url: '../../html/modal/modal_create_content.html', ctrl: 'ContentController'},
            contentEditModal: {id: 'content_update', url: '../../html/modal/modal_edit_content.html', ctrl: 'ContentController'},
            contentDeleteModal: {id: 'content_delete', url: '../../html/modal/modal_edit_content.html', ctrl: 'ContentController'},
            allUsersModal: {id: 'all_users', url: '../../html/modal/modal_all_users.html', ctrl: 'AllUsersController'},
            chatModal: {id: 'chat', url: '../../html/modal/modal_chat.html', ctrl: 'MessageController'},
            followerModal: {id: 'followers', url: '../../html/modal/modal_followers.html', ctrl: 'FollowersController'}
        }

    };

    app.factory("Resources", [Resources]);
}());