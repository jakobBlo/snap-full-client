/**
 * Schließt das modal_create_content.html über den ModalService
 */
closeContentModal = function(){
    ModalService.closeCurrentModal(Resources.contentModal.id);
};

/**
 * Schließt das modal_edit_content.html über den ModalService
 */
closeContentEditModal = function() {
    ModalService.closeCurrentModal(Resources.contentEditModal.id);
};

/**
 * Schließt das modal_delete_content.html über den ModalService
 */
closeContentDeleteModal = function() {
    ModalService.closeCurrentModal(Resources.contentDeleteModal.id);
};

/**
 * Sendet den erzeugten Content im WYSIWYG-Editor über den ContentService
 * an das Snap! - Backend
 * @param {String} htmlContent: Der übergeben HTML-Content als String
 */
submit = function(htmlContent){
    ContentService.submit(htmlContent);
    ModalService.closeCurrentModal(Resources.contentModal.id);
};

/**
 * Lädt einen HTML-Content-String in den WYSIWYG-Editor
 */
getCurrHtmlContent = function(){
    return ContentService.getCurrHtmlContent();
};