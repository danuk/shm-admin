angular
    .module('shm_user', [
])
.controller('ShmUserController',
    ['$scope','$location','$route','shm_request', function($scope, $location, $route, shm_request) {
    'use strict';

    if ( !$scope.user.user_id ) {
        $location.path('/users');
    } else {
        shm_request('GET','/v1/admin/user', { user_id: $scope.user.user_id } ).then(function(response) {
            $scope.data = response.data.data[0];
        });
    }

    $scope.save = function() {
        shm_request('POST_JSON','/v1/admin/user', $scope.data ).then(function() {
            $location.path('/users');
        })
    }

    $scope.passwd = function () {
        var new_password = prompt("Enter new password:");
        if ( new_password ) {
            var data = {
                user_id: $scope.user.user_id,
                password: new_password
            };
            shm_request('POST_JSON','/v1/admin/user/passwd', data ).then(function() {
                $location.path('/users');
            })
        }
    }

}]);

