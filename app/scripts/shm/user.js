angular
    .module('shm_user', [
])
.controller('ShmUserController',
    ['$scope','$location','$window','$route','$rootScope','shm_request', function($scope, $location, $window, $route, $rootScope, shm_request) {
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

    $scope.delete = function () {
        $rootScope.requireOTP().then(function(allowed) {
            if (allowed) {
                var str = prompt("Type 'delete' to confirm delete user:");
                if ( str == 'delete' ) {
                    var data = {
                        user_id: $scope.user.user_id,
                    };
                    shm_request('DELETE','/v1/admin/user', data ).then(function() {
                        $location.path('/users');
                    })
                }
            }
        });
    };

    $scope.cli_login = function () {
        shm_request('GET','/v1/admin/config/cli' ).then(function(response) {
            var url = response.data.data[0].url;
            shm_request('PUT','v1/admin/user/session', { user_id: $scope.user.user_id } ).then(function(response) {
                var session_id = response.data.id;
                $window.open( url + '/shm/user/auth.cgi?session_id=' + session_id, '_blank');
            })
        })
    }

}]);

