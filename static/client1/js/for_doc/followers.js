/**
 * Initialisert einen Chat zu einem Follower
 * Dafür wird zunächst der bereits vorhandene Chatcontent geladen über den MessageService geladen
 * aus dem Backend geladen und nach Öffnen des
 * modal_chat.html angezeigt.
 * @param anotherUser: Der User zu dem der Chat aufgebaut werden soll
 */
message = function (anotherUser) {
    MessageService.setPartner(anotherUser._id);
    MessageService.loadChatContent();
    ModalService.openModal(Resources.chatModal.id, Resources.chatModal.url, Resources.chatModal.ctrl);
};

/**
 * Holt die Follower-Liste aus dem Overview-Service und zeigt diese
 * im modal_followers.html an.
 * @returns {Array} Die Follower-Liste für das modal_followers.html
 */
getFollowers = function(){
    return OverviewService.getFollowers();
};

/**
 * Holt die zu dem eingeloggten User gehörenden Follower über den
 * OverviewService auf dem Backend, öffnet das modal_followers.html
 * und zeigt diese dort an.
 */
receiveFollowers = function(){
    console.log('called: receiveFollowers')
    OverviewService.initFollowers();
    ModalService.openModal(Resources.followerModal.id, Resources.followerModal.url, Resources.followerModal.ctrl);
};

/**
 * Schließt das modal_followers.html über den ModalService
 */
closeFollowers = function(){
    ModalService.closeCurrentModal(Resources.followerModal.id);
};