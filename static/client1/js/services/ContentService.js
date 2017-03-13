/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function() {

    var app = angular.module("TestClient");

    var ContentService = function($rootScope) {

        var allContent = [];
        var currHtmlContent;
        var events;
        var socket;
        var userObj;
        var token;
        var loaded = [];

        // allContent.push({contentString: "content here", type: "html"});

        /**
         * Initializes handlers on the defined socket io events
         */
        var init = function () {
            userObj = JSON.parse(localStorage.getItem('user'))
            token = localStorage.getItem('token')

            socket.on(events.save_content.success, function(resp) {
                console.log('SAVED CONTENT' + resp);
                if(resp.type == 'html') allContent.push(resp);
            });

            socket.on(events.save_content.error, function(resp) {
                //TODO: give any feedback on UI
                console.log('user saved content error');
                console.log(resp);
            });

            socket.on(events.user_save_content.success, function(resp) {
                console.log('SAVED CONTENT FROM USER' + resp);
                if(resp.type == 'html') allContent.unshift(resp);

            });

            socket.on(events.user_save_content.error, function(resp) {
                console.log('user saved content error');
                console.log(resp);
            });

            socket.on(events.user_update_content.success, function(resp) {
                // TODO: implement
                // 1. Find Content in list
                // 2. replace with updated content
            });

            socket.on(events.user_update_content.error, function(resp) {
                console.log('user saved content error');
                console.log(resp);
            });

            socket.on(events.load_content.success, function(resp) {
                console.log("LOADED CONTENT: " + JSON.stringify(resp[0]));
                if(resp[0] && resp[0].type == 'html') allContent.unshift(resp[0]);
            });

            loadHTMLContentForContentIDs(userObj.content);

            $rootScope.$on('followers_complete', function(event, user_list) {
                console.log("EVENT followers_complete: " + JSON.stringify(user_list))
                var temp = [];
                for(var i = 0; i < user_list.length; i++) {
                    var currContent = user_list[i].content
                    for(var j = 0; j < currContent.length; j++) {
                        temp.push(currContent[j]);
                    }
                }

                loadHTMLContentForContentIDs(temp)
            });
        };

        var loadHTMLContentForContentIDs = function(ids){
            //console.log("USER OBJ CONTENT: " + JSON.stringify(userObj.content))
            console.log("GOT CONTENT ID: " + JSON.stringify(ids));
            for(var i = 0; i < ids.length; i++) {
                console.log("EMITTING FOR: " + JSON.stringify(ids[i]));
                socket.emit(events.load_content.success, {token: token, payload: {_id: ids[i].content_id}});
            }
        };

        var submit = function(content) {
            console.log('submitting: ' + content);
            currHtmlContent = content;

            var data = {token: localStorage.getItem('token'), payload: {contentString: content, type: "html"}}
            socket.emit(events.save_content.success, data);
        };

        var getAllContent = function(){
            return allContent;
        };

        var setSocket = function(ss) {
            socket = ss;
        };

        var setEvents = function(es) {
            events = es;
        };

        var parseContent = function(index) {
            var html = allContent[index].contentString
            // TODO: implement
        };

        var getCurrHtmlContent = function(){
            return currHtmlContent;
        };

        return {
            getAllContent: getAllContent,
            setSocket: setSocket,
            init: init,
            submit: submit,
            setEvents: setEvents,
            parseContent: parseContent,
            getCurrHtmlContent: getCurrHtmlContent,
            loadHTMLContentForContentIDs: loadHTMLContentForContentIDs
        }
    };

    app.factory("ContentService", ['$rootScope', ContentService]);
}());
