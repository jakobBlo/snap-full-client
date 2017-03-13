/**
 * Sendet eine Chatnachricht an User zu dem entweder bereits eine WebRTC-Verbindung
 * aufgebaut ist oder baut diese zunächst auf und sendet die Nachricht anschließend
 * @param {String} message: Die zu sendene Chatnachricht
 */
sendMessage = function(message) {
    MessageService.sendMessage(message);
};

/**
 * Gibt eine Liste der bisher ausgetauschten Chatnachrichten zwischen zwei
 * Benutzern über den MessageService zurück
 */
getMessages = function(){
    return MessageService.getMessages();
};

/**
 * Schließt das modal_chat.html und speichert die ausgetauschten
 * Textnachrichten im Snap-Backend
 * Sollte ein Videochat laufen, wird dieser ebenso gestoppt
 */
closeChat = function(){
    MessageService.stopVideoChat();
    MessageService.saveChatProcess();
    ModalService.closeCurrentModal(Resources.chatModal.id);
};

/**
 * Initialiert einen Videochat nach Klicken des entsprechenden Buttons im modal_chat.html.
 * Hierzu wird, wenn noch nicht vorhanden, eine WebRTC-Verbindung
 * zum anderen Peer aufgebaut.
 */
initVideoChat = function(){
    MessageService.initVideoChat();
};

/**
 * Prüft ob ein Videochat am Laufen ist.
 */
videoChatRunning = function(){
    return MessageService.videoChatRunning();
};

/**
 * Beendet den Laufenden Videochat im modal_chat.html und schließt dabei
 * den Anzeigebereich des Streams
 */
stopVideoChat = function () {
    MessageService.stopVideoChat();
};

/**
 * Gibt den MediaStream des Peers zu dem ein Videochat aufgebaut ist
 * zurück und zeigt diesen im modal_chat.html an
 */
getRemoteStream = function(){
    return MessageService.getRemoteStream();
};

/**
 * Gibt den User zurück, zu dem ein Chat aufgebaut ist.
 */
getPartnerUserObj = function(){
    return MessageService.getPartnerUserObj();
};