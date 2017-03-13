/**
 * Loggt den angemeldet User aus und sendet dabei ein entsprechendes Event
 * mit den von der Snap-API benötigten Daten an das Backend
 */
logout = function () {
    LogoutService.logout();
}