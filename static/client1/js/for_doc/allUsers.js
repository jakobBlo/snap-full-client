/**
 * Holt die Userliste in der alle User angezeigt werden aus dem OverviewService
 * Die UI zeigt die Daten dann entsprechend durch ng-repeat an
 * @returns {Array} Liste aller User
 */
getAllUsers = function () {
    return OverviewService.getAllUsers();
};

/**
 * Setzt einen Followrequest an den OverviewService ab.
 * @param {Integer} index: Der Index des Users in einer Liste
 * @param {Array} list: Die übergeben Userliste in der der User
 * durch den index gefunden werden soll
 */
follow = function (index, list) {
    OverviewService.follow(index, list);
};

/**
 * Löscht einen Follow über den OverviewService ab.
 * @param {Integer} index: Der Index des Users in einer Liste
 * @param {Array} list: Die übergeben Userliste in der der User
 * durch den index gefunden werden soll
 */
unfollow = function (index, list) {
    OverviewService.unfollow(index, list);
};

/**
 * Schließt das Modal modal_all_users.html
 */
closeAllUsers = function(){
    ModalService.closeCurrentModal(Resources.allUsersModal.id);
};

/**
 * Lädt alle User über den OverviewService aus dem Snap! Backend
 * Anschließend wird das modal_all_users.html auf der UI geöffnet
 * und die ermittelten Daten angezeigt
 */
receiveAllUsers = function () {
    OverviewService.receiveAllUsers();
    ModalService.openModal(Resources.allUsersModal.id, Resources.allUsersModal.url, Resources.allUsersModal.ctrl);
};

/**
 * Sendet eine Nachricht über den MessageService an den übergebenen User
 * @param anotherUser: Der User an den die Nachricht verschickt werden soll.
 */
message = function (anotherUser) {
    MessageService.setPartner(anotherUser._id);
    MessageService.loadChatContent();
    ModalService.openModal(Resources.chatModal.id, Resources.chatModal.url, Resources.chatModal.ctrl);
};