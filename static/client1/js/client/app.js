/**
 * @Author: Jan Dieckhoff
 * @Date: 08.12.2016
 */
(function(){
    var app = angular.module("TestClient", ['ui.bootstrap', 'luegg.directives', 'ckeditor', 'ngSanitize', 'angular-jwt', 'ngRoute']);
    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/login", {
                templateUrl : "../../html/login.html"
            })
            .when("/overview", {
                templateUrl : "../../html/overview.html"
            })
            .otherwise({
                redirectTo: '/login'
            });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });
}());
