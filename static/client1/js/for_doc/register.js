/**
 * Prüft ob alle Felder im modal_register.html befüllt wurden
 * Erst dann wird der Submit-Button aktiviert.
 * @returns {boolean}: alle Eingaben korrekt und Passwort stimmt mit Confirmation
 * überein.
 */
inputMissing = function () {
    var missing = false;
    for(var key in $scope.register) {
        if($scope.register.hasOwnProperty(key)) {
            if($scope.register[key] == '') {
                missing = true;
                break
            }
        }
    }
    return missing || !$scope.passwordsEqual();
};

/**
 * Prüft ob das Wunschpasswort mit der Passwortconfirmation übereinstimmt
 * @returns {boolean}: Passwörter stimmen überein
 */
passwordsEqual = function () {
    return $scope.register.password == $scope.register.passwordConf;
};

/**
 * Verschickt die eingebenen Benuterdaten der Registrierung über den RegisterService
 * an das Backend
 */
ubmitRegistrationData = function () {
    RegisterService.submitRegistrationData($scope.register);
    reset();
};

/**
 * Schließt das modal_register.html
 */
closeRegister = function () {
    ModalService.closeCurrentModal(Resources.registerModal.id);
};

/**
 * Prüft ob ein Fehler im Response nach der Registrierung vorliegt
 * @returns {boolean}: Ein Error-Response liegt vor (true/false)
 */
isError = function(){
    return RegisterService.isError();
};

/**
 * Zeigt die Fehlermeldung (falls vorhanden) für den User aus dem
 * Fehlerobjekt im modal_register.html an
 */
showError = function(){
    return RegisterService.showError();
};

/**
 * Setzt alle getätigten Eingaben im modal_register.html zurück
 */
function reset() {
    for(var key in $scope.register) {
        if($scope.register.hasOwnProperty(key)) {
            $scope.register[key] = '';
        }
    }
}