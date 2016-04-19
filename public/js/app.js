var app = angular.module('app', []);

app.controller('chatController', ['$scope', '$http', function ($scope, $http) {

    $scope.refrescar = function () {
        $http({
            method: 'GET',
            url: '/mensajes/all'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.mensajes = response.data;
        }, function errorCallback(response) {
            console.log("La rego el angular!!! :(");
            console.log(response);
        });
    }

    $scope.nuevoMensaje = function () {
        $scope.mensaje.nombrePersona = "";
        $scope.mensaje.texto = "";
    }
}]);