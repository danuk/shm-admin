angular
  .module('shm_config', [
  ])
  .service('shm_config', ['$modal', 'shm', 'shm_request', function($modal, shm, shm_request) {
    this.edit = function(row, title) {
        return $modal.open({
            templateUrl: 'views/config_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title || 'Редактирование';
                $scope.data = angular.copy(row);

                var url = 'v1/admin/config';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    shm_request( $scope.data.new ? 'PUT_JSON' : 'POST_JSON', url, $scope.data ).then(function(responce) {
                        $modalInstance.close( responce.data.data[0] );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE', url, { key: row.key } ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

            },
            size: 'lg',
        });
    };
    this.setupOTP = function (row) {
        return $modal.open({
            templateUrl: 'views/otp_setup_modal.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Настройка двухфакторной аутентификации (OTP)';
                $scope.otp_setup = angular.copy(row);
                $scope.otp_setup_step = 1;

                setTimeout(function() {
                        var qrElement = document.getElementById("qrcode");
                        if (qrElement && $scope.otp_setup.qr_url) {
                            qrElement.innerHTML = '';
                            new QRCode(qrElement, {
                                text: $scope.otp_setup.qr_url,
                                width: 200,
                                height: 200,
                                colorDark: "#000000",
                                colorLight: "#ffffff"
                            });
                        }
                    }, 100);

                $scope.verifyOtp = function() {
                    $scope.otp_error = '';
                    
                    if (!$scope.otp_setup.otp_verify_token) {
                        $scope.otp_error = 'Введите код из приложения';
                        return;
                    }
                    
                    shm_request('POST','v1/user/otp/enable', { token: $scope.otp_setup.otp_verify_token }).then(function(response) {
                        if (response.data.data && response.data.data[0] && response.data.data[0].success) {
                            $scope.otp_setup_success = true;
                            $modalInstance.dismiss('cancel');
                        }
                    }).catch(function(error) {
                      if (error.data && error.data.error) {
                        switch(error.data.error) {
                          case 'TOKEN_REQUIRED':
                            $scope.otp_error = 'Требуется токен';
                            break;
                            case 'INVALID_TOKEN':
                              $scope.otp_error = 'Недействительный токен. Проверьте код и попробуйте снова.';
                              break;
                              case 'OTP_NOT_SETUP':
                                $scope.otp_error = 'OTP не настроен. Начните настройку заново.';
                                break;
                                default:
                                  $scope.otp_error = error.data.error;
                            }
                        } else {
                            $scope.otp_error = 'Ошибка сети или сервера';
                        }
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: 'lg',
        });
    };
  }])
  .controller('ShmConfigController', ['$scope', '$window', '$http', 'shm_config', 'shm_request', function($scope, $window, $http, shm_config, shm_request) {
    'use strict';

    var url = 'v1/admin/config';
    $scope.url = url;
    $scope.parent_key_id = 'key';

    $scope.columnDefs = [
        {
            field: 'key',
            width: 300,
        },
        {
            field: 'value',
        },
    ];

    $scope.add = function() {
        var row = {
            new: 1
        };

        shm_config.edit(row, 'Создание параметра').result.then(function(data){
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_config.edit(row).result.then(function(data){
            delete row.$$treeLevel;
            angular.extend( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    };

    $scope.otp = false;
    $scope.otp_enabled = false;

    function status() {
        $http({ method: 'GET', url: 'shm/v1/user/otp/status', withCredentials: true, }).then(
            function successCallback(response) {
                var status = response.data.data[0];
                if ( status ) {
                    $scope.otp = true;
                    if ( status.enabled == 1 ) {
                        $scope.otp_enabled = true;
                    }
                } else {
                    $scope.otp = false;
                    $window.localStorage['theme.settings.otp'] = 'off';
                }
            }, function errorCallback(response) {
                $scope.otp = false;
                $scope.otp_enabled = false;
                $window.localStorage['theme.settings.otp'] = 'off';
            }
        );
    };

    $scope.setupOTP = function() {
        shm_request('POST','v1/user/otp/setup').then(function(response) {
            shm_config.setupOTP(response.data.data[0]).result.then(function() {
            }, function(cancel) {
            });
        });
    };

    $scope.disableOTP = function () {
        var str = prompt("Type 'OTP code' to confirm disable OTP");
        if ( str.length >= 6 ) {
            var data = {
                token: str,
            };
            shm_request('POST','/v1/user/otp/disable', data ).then(function() {
                status();
            })
        }
    };

    if ($window.localStorage['theme.settings.otp'] !== 'off') {
        status();
    }

  }]);
