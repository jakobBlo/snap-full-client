/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */
(function () {

    var app = angular.module("TestClient");


    var OverviewService = function ($rootScope) {

        var events;
        var users_online = [];
        var users_all = [];
        var users_following = [];
        var users_followers = [];
        var token;
        var userObj;
        var socket;

        function initOnlineUsers() {
            console.log("emitted");
            socket.emit(events.online_users.success, {token: token, payload: {}});
        }

        function initFollowing() {
            var follows = userObj.followl;
            for(var i = 0; i < follows.length; i++) socket.emit(events.spec_user.success, {token: token, payload: {'_id': follows[i].to}});
            // follows.forEach(function (u) {
            //     socket.emit(events.spec_user.success, {token: token, payload: {'_id': u.to}})
            // });
        }

        function initFollowers() {
            users_followers = []
            var follows = userObj.followedl;
            follows.forEach(function (u) {
                console.log("get user for id: " + JSON.stringify(u.from));
                socket.emit(events.spec_user.success, {token: token, payload: {'_id': u.from}})
            });
        }

        /**
         * Initializes handlers on the defined socket io events
         */
        var init = function () {
            token = localStorage.getItem('token');
            userObj = JSON.parse(localStorage.getItem('user'));

            socket.on(events.authenticate.error, function (user) {
                console.log('authentication error: ' + JSON.stringify(user));
            });

            socket.on(events.online_users.success, function (users) {
                users_online = [];
                users.forEach(function (user) {
                    if(user._id != userObj._id) {
                        addUser(user, users_online);
                    }

                });
                console.log('on online users: ', JSON.stringify(users_online));
            });


            socket.on(events.online_users.error, function (response) {
                console.log('error online users: ' + JSON.stringify(response))
            });


            socket.on(events.all_users.success, function (users) {
                users_all = [];
                users.forEach(function (user) {
                    addUser(user, users_all)
                    console.log('user: ' + JSON.stringify(user))
                });
            });

            socket.on(events.all_users.error, function (response) {
                console.log('error all users: ' + JSON.stringify(response))
            });

            socket.on(events.user_logout.success, function (user) {
                console.log("Offline: " + JSON.stringify(user));
                removeUser(user, users_online);
                var u = users_followers[findUserIndex(user, users_followers)];
                var u2 = users_following[findUserIndex(user, users_following)];
                if (u) u.online = false;
                if (u2) u2.online = false;
            });

            socket.on(events.user_login.success, function (user) {
                console.log("Online: " + JSON.stringify(user));
                addUser(user, users_online);
                var u = users_followers[findUserIndex(user, users_followers)];
                var u2 = users_following[findUserIndex(user, users_following)];
                if (u) u.online = true;
                if (u2) u2.online = true;
            });

            socket.on(events.follow.success, function (user) {
                console.log("follow: " + JSON.stringify(user));
                addUser(user, users_following);
            });

            socket.on(events.unfollow.success, function (user) {
                console.log('on unfollow: ' + JSON.stringify(user))
                removeUser(user, users_following);
            });

            socket.on(events.unfollow.error, function (user) {
                console.log('error unfollow: ' + JSON.stringify(user))
            });

            socket.on(events.followedBy.success, function (id) {
                console.log("followBy: " + JSON.stringify(id));
                userObj.followedl.push({from: id, properties: {}});
                console.log("Followed List: " + JSON.stringify(userObj.followedl))
            });

            socket.on(events.followedBy.error, function (id) {
                console.log('ERROR followedBy: ' + JSON.stringify(id))
            });

            socket.on(events.unFollowedBy.success, function (id) {
                console.log("unFollowedBy: " + JSON.stringify(id));
                console.log("Followed  before: " + JSON.stringify(userObj.followedl))
                var index = getIndex(userObj.followedl, id)
                console.log("unfollowedBy index: " + index)
                userObj.followedl.splice(index, 1)
                console.log("Followed  after: " + JSON.stringify(userObj.followedl))
            });

            socket.on(events.unFollowedBy.error, function (user) {
                console.log('ERROR followedBy: ' + JSON.stringify(user))
            });

            socket.on(events.spec_user.success, function (userData) {
                var follows = userObj.followl;
                var followedBy = userObj.followedl;
                console.log("USER DATA ON SPEC USER: " + JSON.stringify(userData));
                if (containsId(follows, userData[0]._id, 'to') && !containsUser(userData[0], users_following)) {
                    addUser(userData[0], users_following);
                    if(users_following.length === follows.length) {
                        console.log("FOLLOWING COMPLETE");
                        $rootScope.$broadcast('followers_complete', users_following);
                    }
                } else if (containsId(followedBy, userData[0]._id, 'from') && !containsUser(userData[0], users_followers)) {
                    addUser(userData[0], users_followers);
                    // console.log('added user to users_followers: ' + JSON.stringify(userData[0]));
                } else {
                    // console.log('error adding user to conn list!!!!');
                }
            })
            initFollowing();
            initOnlineUsers();
        };

        function getIndex(list, id) {
            for(var i = 0; i < list.length; i++) {
                if(list[i].from == id) {
                    return i;
                }
            }
            return -1;
        }

        function containsId(list, id, type) {
            // console.log('LIST: ' + JSON.stringify(list));
            // console.log('ID: ' + JSON.stringify(id));
            for (var i = 0; i < list.length; i++) {
                if (list[i].hasOwnProperty(type)) {
                    if (list[i][type] == id) {
                        return true;
                    }
                }
            }
            return false;
        }

        function removeUser(user, list) {
            var index = findUserIndex(user, list)
            if (index > -1) {
                list.splice(index, 1);
            }
        }

        function findUserIndex(user, list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i]._id == user._id) {
                    return i;
                }
            }
            return -1;
        }

        function containsUser(user, list) {
            var index = findUserIndex(user, list);
            return index > -1;
        }


        function addUser(user, list) {
            if (!containsUser(user, list)) {
                list.push(user);
            }
        }

        function follow(index, list) {

            var user = list[index];

            if (user) {
                var data = {token: localStorage.getItem('token'), payload: {userIdFrom: userObj._id, userIdTo: user._id}};
                socket.emit(events.follow.success, data);
            } else {
                //TODO: error handling
            }
        }

        function unfollow(index, list) {
            var user = list[index];

            // TODO: This is a Workaround!! Delete later when deleteConnections working completely
            // ========================================
            removeUser(user, list);
            // ========================================
            if (user) {
                var data = {token: localStorage.getItem('token'), payload: {userIdFrom: userObj._id, userIdTo: user._id}};
                socket.emit(events.unfollow.success, data);
            } else {
                //TODO: error handling
            }
        }

        function receiveAllUsers() {
            var data = {token: localStorage.getItem('token'), payload: {}}
            socket.emit(events.all_users.success, data);
        }

        function getOnlineUsers() {
            return users_online;
        }

        function getFollowing() {
            return users_following;
        }

        function getFollowers() {
            return users_followers;
        }

        function getAllUsers() {
            return users_all;
        }

        function getUserAnyList(userId) {
            var userData = {_id: userId};
            var temp = users_online.concat(users_all).concat(users_following).concat(users_followers);
            var index = findUserIndex(userData, temp);
            if (index > -1) return temp[index];
            return null;
        }

        var setSocket = function (ss) {
            socket = ss;
        }

        var setEvents = function(es) {
            events = es;
        }

        return {
            follow: follow,
            unfollow: unfollow,
            receiveAllUsers: receiveAllUsers,
            getOnlineUsers: getOnlineUsers,
            getFollowing: getFollowing,
            getFollowers: getFollowers,
            initFollowers: initFollowers,
            getAllUsers: getAllUsers,
            getUserAnyList: getUserAnyList,
            setSocket: setSocket,
            init: init,
            setEvents: setEvents
        }
    };

    app.factory("OverviewService", ['$rootScope',OverviewService]);
}());
