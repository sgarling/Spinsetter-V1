myModule.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
    
    var socket = io.connect();
    $scope.username = "";
    $scope.password = "";
     
    $scope.login = function() {
        socket.emit('login', loginData);    
    }; 
}]);
