angular
    .module('shm_user', [
])
.controller('ShmUserController',
    ['$scope','$location','$window','$route','shm_request', 'shm_bonuses', 'shm_pays', function($scope, $location, $window, $route, shm_request, shm_bonuses, shm_pays) {
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

    $scope.add_bonus = function() {
        var row = {
            next: null,
            user_id: $scope.user.user_id || null,
        };
        
        shm_bonuses.make_bonus('Начислить бонусы', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON','/v1/admin/user/bonus', data ).then(function(response) {
                $scope.data.bonus = response.data.data[0].bonus;
            });
        }, function(cancel) {
        });
    }

    $scope.make_pay = function() {
        var row = {
            next: null,
            user_id: $scope.user.user_id || null,
        };

        shm_pays.make_pay('Принять платеж', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON','/v1/admin/user/payment', data ).then(function(response) {
                $scope.data.balance = response.data.data[0].money;
            });
        }, function(cancel) {
        });
    };

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

