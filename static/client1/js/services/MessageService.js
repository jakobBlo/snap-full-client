/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */

(function () {

    var app = angular.module("TestClient");


    var MessageService = function ($modal, $rootScope,ModalService, OverviewService, Resources) {

        var events;
        var messages = [];                          // Text Messages
        var user;
        var modalInstance = null;                   // The Chatmodal instance

        var signaled = false;                       // Flag to check if partner peer has been signaled before communication starts
        var thisPeer;                               // Peer of the current logged in user
        var partnerID;                              // Identificator for the other peer
        var anotherPeer;                            // Peer of the other User
        var peerId;
        var mediaStream = null;                     // the remote media stream for A/V Calls
        var mediaStreamURL = '';                    // the object URL of the remote stream
        var mediaConnection = null;                 // the A/V stream connection object
        var debug = true;                           // debug mode

        var local = true;                           // change this flag for web deployment

        var socket;


        /**
         * Creates the peer of the current logged in user and registers him
         * at the signaling server
         */
        var createPeer = function () {
            thisPeer = new Peer(peerId, {
                host: local ? "localhost" : "jd-hh.de",
                port: location.protocol === 'https:' ? 443 : local ? 3001 : 80,
                path: '/peerjs',
                debug: debug,
                config: {
                    'iceServers': [
                        {url: 'stun:stun.l.google.com:19302'},
                        {
                            url: 'turn:numb.viagenie.ca',
                            credential: 'muazkh',
                            username: 'webrtc@live.com'
                        }
                    ]
                }
            });
            initPeer();
        };

        /**
         * initializes possible peer events such as
         * incoming connectins, text messages, media calls
         */
        var initPeer = function () {
            thisPeer.on('connection', function (conn) {
                partnerID = conn.peer;
                console.log('connection to: ' + conn.peer);
                conn.on('data', function (msg) {
                    if (!ModalService.getModalInstance(Resources.chatModal.id)) {
                        ModalService.openModal(Resources.chatModal.id, Resources.chatModal.url, Resources.chatModal.ctrl);
                    }
                    console.log('Received', JSON.stringify(msg));
                    $rootScope.$apply(function () {
                        messages.push(msg);
                    })
                });
                onIncomingVideoChats();
            });
        };


        /**
         * Handles incoming Video chats
         * Opens the Chat modal if not open
         * Receives user camera and microphone credentials
         * creates the remote stream and sending this by answering the call
         * creates the object url of the incoming stream
         * Video chat is now established
         */
        var onIncomingVideoChats = function () {
            thisPeer.on('call', function (call) {

                mediaConnection = call;

                if (!ModalService.getModalInstance(Resources.chatModal.id)) {
                    ModalService.openModal(Resources.chatModal.id, Resources.chatModal.url, Resources.chatModal.ctrl);
                }

                navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;

                navigator.getUserMedia({video: true, audio: true}, function (str) {
                    mediaConnection.answer(str); // Answer the call with an A/V stream.
                    mediaConnection.on('stream', function (remoteStream) {
                        $rootScope.$apply(function () {
                            mediaStream = remoteStream;
                            mediaStreamURL = window.URL.createObjectURL(mediaStream);
                        });
                    });
                }, function (err) {
                    console.log('Failed to get local stream', err);
                });
            });
        };

        /**
         * Initializes handlers on the defined socket io events
         */
        var init = function () {

            user = JSON.parse(localStorage.getItem('user'));    // Current logged in Userr
            peerId = user._id;
            createPeer();
            socket.on(events.save_content.success, function (response) {
                //console.log('Saved Content: ' + JSON.stringify(response));
            });

            socket.on(events.save_content.error, function (response) {
               // console.log('Saved Content Error: ' + JSON.stringify(response));
            });

            socket.on(events.load_content.success, function (response) {
                //console.log('Loaded Content: ' + JSON.stringify(response));
            });

            socket.on(events.load_content.error, function (response) {
                //console.log('Loaded Content Error: ' + JSON.stringify(response));
            });
        };


        /**
         * Starts the signaling process to another peer
         * and returns the peer object on success
         * @param toId
         * @param debug
         * @returns {Promise|*}
         */
        var signal = function (toId) {
            signaled = true;
            console.log('signal fired');
            anotherPeer = thisPeer.connect(toId);
            if (debug) {
                var msg = {userName: "SERVER", msg: "WebRTC connection to " + toId + " established"};
                messages.push(msg);
            }
            return anotherPeer;
        };

        /**
         * Sends a text message to another peer.
         * if the other peer has not been signaled, he will get signaled first
         * following sending the message.
         * @param currMessage
         */
        var sendMessage = function (currMessage) {
            var msg = {userName: user.userName, msg: currMessage};
            var partnerUserObj = OverviewService.getUserAnyList(partnerID);

            if(partnerUserObj && partnerUserObj.online) {
                if (!signaled) {
                    anotherPeer = signal(partnerID);
                    anotherPeer.on('open', function () {
                        anotherPeer.send(msg);
                    });
                    signaled = true;
                } else {
                    anotherPeer.send(msg);
                }
            } else {
                // TODO: Gucken ob es MessageContent gibt, wenn nicht einfügen, sonst nur update
            }
            messages.push(msg);
        };

        /**
         * Opens the chat window
         */
        var openChatModal = function () {
            console.log('is open');
            modalInstance = $modal.open({
                templateUrl: '../../html/modal/modal_chat.html',
                controller: 'MessageController',
            })
        };

        /**
         * Closes the chat window
         */
        var closeChatModal = function () {
            stopVideoChat();
            modalInstance.close();
            modalInstance = null;
        };

        /**
         * Stops a running peer to peer video chat
         */
        var stopVideoChat = function () {
            if (mediaConnection != null) {
                mediaStream.getTracks().forEach(function (t) {
                    t.stop();
                })
                mediaConnection.close();
                mediaConnection = null;
                mediaStream = null;
                mediaStreamURL = '';
            }
        };


        /**
         * saves chat process as content to backend
         */
        var saveChatProcess = function () {
            var content = {
                from: [user._id],
                type: 'chat',
                user_data: {
                    messages: getMessages()
                },
                to: [partnerID]
            };
            socket.emit(events.save_content.success, {token: localStorage.getItem('token'), payload: {contentString: content, type: 'chat'}})
        };


        /**
         * loads chat process as content from backend
         */
        var loadChatContent = function () {
            var content = {
                from: [user._id],
                type: 'chat',
                user_data: {
                    messages: getMessages()
                },
                to: [partnerID]
            };
            socket.emit(events.load_content.success, {token: localStorage.getItem('token'), payload: content})
        };


        /**
         * Initializes a video stream to another peer
         * Receives the user camera and microphone credentials, creates a remote stream
         * and sends this stream to the other peer.
         * After that it waits for the remote stream of the other peer and saves the object url.
         * Video chat is now established
         */
        var initStream = function () {
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            navigator.getUserMedia({video: true, audio: true}, function (stream) {
                mediaConnection = thisPeer.call(partnerID, stream);
                mediaConnection.on('stream', function (remoteStream) {
                    $rootScope.$apply(function () {
                        mediaStream = remoteStream;
                        mediaStreamURL = window.URL.createObjectURL(mediaStream);
                        console.log("success call");
                    });
                });
            }, function (err) {
                console.log('Failed to get local stream', err);
            });
        };

        /**
         * Initializes a video chat to another peer
         * signales the peer if not already done and
         * initialises the stream
         */

        var initVideoChat = function () {
            if (!signaled) {
                anotherPeer = signal(partnerID);
                anotherPeer.on('open', function () {
                    initStream();
                })
            } else {
                initStream();
            }
        };


        var getRemoteStream = function () {
            return mediaStreamURL;
        };

        var videoChatRunning = function () {
            return mediaStreamURL != '' && mediaStreamURL != null && mediaStreamURL != undefined;
        };


        var getMessages = function () {
            return messages;
        };

        var setPartner = function (userName) {
            partnerID = userName
        };

        var getPartnerUserObj = function(){
            var u = OverviewService.getUserAnyList(partnerID);
            console.log('PARTNER USER OBJ: ' + JSON.stringify(u));
            return u;
        };

        var setSocket = function(ss) {
            socket = ss;
        }

        var setEvents = function(es) {
            events = es;
        }

        //initOnSocketEvents();

        return {
            initVideoChat: initVideoChat,
            sendMessage: sendMessage,
            signal: signal,
            getMessages: getMessages,
            setPartner: setPartner,
            openChatModal: openChatModal,
            saveChatProcess: saveChatProcess,
            loadChatContent: loadChatContent,
            closeChatModal: closeChatModal,
            getRemoteStream: getRemoteStream,
            videoChatRunning: videoChatRunning,
            stopVideoChat: stopVideoChat,
            getPartnerUserObj: getPartnerUserObj,
            setSocket: setSocket,
            init: init,
            setEvents: setEvents
        }
    };

    app.factory("MessageService", ['$modal', '$rootScope', 'ModalService', 'OverviewService',
        'Resources', MessageService]);
}());
