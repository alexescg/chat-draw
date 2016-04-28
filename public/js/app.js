var app = angular.module('app', []);

app.controller('chatController', ['$scope', '$http', function ($scope, $http) {

    var socket = io.connect("http://localhost:8080", {'forceNew': true});
    $scope.messages = $scope.messages || [];
    $scope.mensaje = new Object();

    socket.on('sendMessages', function (data) {
        console.log(data.emitted.fulfill);
        $scope.messages = data.emitted.fulfill[0];
        $scope.$apply();
    });

    $scope.enviarMensajeNuevo = function () {
        socket.emit('newMessage', $scope.mensaje);
    }
}]);