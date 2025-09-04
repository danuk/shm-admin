angular.module('theme.core.main_controller', ['theme.core.services','ngCookies'])
  .controller('MainController', [
    '$rootScope',
    '$scope',
    '$theme',
    '$timeout',
    'progressLoader',
    'wijetsService',
    '$location',
    '$route',
    '$cookies',
    'shm_request',
    function($rootScope, $scope, $theme, $timeout, progressLoader, wijetsService, $location, $route, $cookies, shm_request ) {
    'use strict';
    $scope.layoutFixedHeader = $theme.get('fixedHeader');
    $scope.layoutPageTransitionStyle = $theme.get('pageTransitionStyle');
    $scope.layoutDropdownTransitionStyle = $theme.get('dropdownTransitionStyle');
    $scope.layoutPageTransitionStyleList = ['bounce',
      'flash',
      'pulse',
      'bounceIn',
      'bounceInDown',
      'bounceInLeft',
      'bounceInRight',
      'bounceInUp',
      'fadeIn',
      'fadeInDown',
      'fadeInDownBig',
      'fadeInLeft',
      'fadeInLeftBig',
      'fadeInRight',
      'fadeInRightBig',
      'fadeInUp',
      'fadeInUpBig',
      'flipInX',
      'flipInY',
      'lightSpeedIn',
      'rotateIn',
      'rotateInDownLeft',
      'rotateInDownRight',
      'rotateInUpLeft',
      'rotateInUpRight',
      'rollIn',
      'zoomIn',
      'zoomInDown',
      'zoomInLeft',
      'zoomInRight',
      'zoomInUp'
    ];

    $scope.user = {};

    $scope.layoutLoading = true;
    $scope.otp_required = false;

    $scope.getLayoutOption = function(key) {
      return $theme.get(key);
    };

    $scope.setNavbarClass = function(classname, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      $theme.set('topNavThemeClass', classname);
    };

    $scope.setSidebarClass = function(classname, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      $theme.set('sidebarThemeClass', classname);
    };

    $scope.layoutFixedHeader = $theme.get('fixedHeader');
    $scope.layoutLayoutBoxed = $theme.get('layoutBoxed');
    $scope.layoutLayoutHorizontal = $theme.get('layoutHorizontal');
    $scope.layoutLeftbarCollapsed = $theme.get('leftbarCollapsed');
    $scope.layoutAlternateStyle = $theme.get('alternateStyle');

    $scope.$watch('layoutFixedHeader', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('fixedHeader', newVal);
    });
    $scope.$watch('layoutLayoutBoxed', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('layoutBoxed', newVal);
    });
    $scope.$watch('layoutLayoutHorizontal', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('layoutHorizontal', newVal);
    });
    $scope.$watch('layoutAlternateStyle', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('alternateStyle', newVal);
    });
    $scope.$watch('layoutPageTransitionStyle', function(newVal) {
      $theme.set('pageTransitionStyle', newVal);
    });
    $scope.$watch('layoutDropdownTransitionStyle', function(newVal) {
      $theme.set('dropdownTransitionStyle', newVal);
    });
    $scope.$watch('layoutLeftbarCollapsed', function(newVal, oldVal) {
      if (newVal === undefined || newVal === oldVal) {
        return;
      }
      $theme.set('leftbarCollapsed', newVal);
    });

    $scope.toggleLeftBar = function() {
      $theme.set('leftbarCollapsed', !$theme.get('leftbarCollapsed'));
    };

    $scope.$on('themeEvent:maxWidth767', function(event, newVal) {
      $timeout(function() {
          $theme.set('leftbarCollapsed', newVal);
      });
    });
    $scope.$on('themeEvent:changed:fixedHeader', function(event, newVal) {
      $scope.layoutFixedHeader = newVal;
    });
    $scope.$on('themeEvent:changed:layoutHorizontal', function(event, newVal) {
      $scope.layoutLayoutHorizontal = newVal;
    });
    $scope.$on('themeEvent:changed:layoutBoxed', function(event, newVal) {
      $scope.layoutLayoutBoxed = newVal;
    });
    $scope.$on('themeEvent:changed:leftbarCollapsed', function(event, newVal) {
      $scope.layoutLeftbarCollapsed = newVal;
    });
    $scope.$on('themeEvent:changed:alternateStyle', function(event, newVal) {
      $scope.layoutAlternateStyle = newVal;
    });

    $scope.toggleSearchBar = function($event) {
      $event.stopPropagation();
      $event.preventDefault();
      $theme.set('showSmallSearchBar', !$theme.get('showSmallSearchBar'));
    };

    $scope.toggleExtraBar = function($event) {
      $event.stopPropagation();
      $event.preventDefault();
      $theme.set('extraBarShown', !$theme.get('extraBarShown'));
    };

    $scope.isLoggedIn = false;

    $scope.logOut = function() {
      shm_request('POST', 'user/logout.cgi').then( function(response) {
          $scope.isLoggedIn = false;
          $cookies.remove('session_id');
          $location.path('/extras-login');
      });
    };

    $rootScope.$on('http_401', function (e, data) {
        if ( $scope.isLoggedIn ) $scope.logOut();
    });

    $scope.logIn = function(login, password, otp_token) {
      progressLoader.start();
      progressLoader.set(50);
	  shm_request('POST', 'v1/user/auth', { login: login, password: password, otp_token: otp_token } ).then( function(response) {
        if ( response.data.id ) {
            var session_id = response.data.id;
            $cookies.put('session_id', session_id);
            $scope.isLoggedIn = true;
            $location.path('/');
        } else if ( response.data.otp_required ) {
          $scope.otp_required = true;
          $location.path('/extras-login');
        } else if ( response.data.status === 'fail' ) {
          $scope.error_message = 'Invalid OTP token';
        }
        progressLoader.end();
      }, function(error) {
            alert('Login or password incorrect!');
            progressLoader.end();
      });
	};

    $scope.checkOTPStatus = function() {
        if (!$scope.isLoggedIn) return Promise.resolve(true);
        
        return shm_request('GET', 'v1/user/otp/status').then(function(response) {
            if (response.data && response.data.data && response.data.data[0]) {
                var otpStatus = response.data.data[0];
                
                if (otpStatus.enabled && otpStatus.required) {
                    return $scope.showOTPVerification().then(function() {
                        return true;
                    }).catch(function() {
                        return false;
                    });
                }
            }
            return true;
        }).catch(function(error) {
            console.error('Error checking OTP status:', error);
            return true;
        });
    };

    $scope.showOTPVerification = function() {
        return new Promise(function(resolve, reject) {
            var code = prompt("Введите OTP код (6 цифр):");
            
            if (!code) {
                reject('cancelled');
                return;
            }
            
            if (code.length < 6) {
                alert('Код должен содержать минимум 6 цифр');
                reject('invalid_length');
                return;
            }
            
            var data = {
                token: code,
            };
            
            shm_request('POST', 'v1/user/otp/verify', data).then(function(response) {
                if (response.data && response.data.data && response.data.data[0] && response.data.data[0].verified) {
                    alert('OTP подтвержден успешно');
                    resolve('verified');
                } else {
                    alert('Неверный код');
                    reject('invalid_code');
                }
            }).catch(function(error) {
                var errorMsg = 'Ошибка верификации';
                if (error.data && error.data.error) {
                    switch(error.data.error) {
                        case 'TOKEN_REQUIRED':
                            errorMsg = 'Введите код';
                            break;
                        case 'INVALID_TOKEN':
                            errorMsg = 'Неверный код';
                            break;
                        case 'OTP_NOT_ENABLED':
                            errorMsg = 'OTP не включен';
                            break;
                        default:
                            errorMsg = error.data.error;
                    }
                }
                alert(errorMsg);
                reject(error);
            });
        });
    };

    $scope.startOTPTimer = function() {
        if ($scope.otpTimer) {
            clearInterval($scope.otpTimer);
        }
        
        $scope.otpTimer = setInterval(function() {
            if ($scope.isLoggedIn) {
                $scope.checkOTPStatus().then(function(allowed) {
                    if (!allowed) {
                        console.log('OTP verification failed, user action blocked');
                    }
                });
            }
        }, 30 * 60 * 1000);
    };

    $rootScope.requireOTP = function() {
        return $scope.checkOTPStatus();
    };

    $scope.$on('$destroy', function() {
        if ($scope.otpTimer) {
            clearInterval($scope.otpTimer);
        }
    });

    $scope.nop = function() {
        shm_request('POST', 'nop.cgi' );
    }

    $scope.sessionCheck = function() {
        var $session_id = $cookies.get('session_id');
        if ($session_id) {
            $scope.isLoggedIn = true;
            return 1;
        }
        return 0;
    };

    $scope.resetUser = function() {
        $scope.user = {};
        $location.path('/#!/user');
    };

    $scope.$on('$routeChangeStart', function() {
      if ( !$scope.sessionCheck() ) return $location.path( '/extras-login' );

      if ($location.path() === '/extras-login') return $location.path('/');
      if ($location.path() === '') return $location.path('/');

      progressLoader.start();
      progressLoader.set(50);
    });

    $scope.$on('$routeChangeSuccess', function() {
      progressLoader.end();
      if ($scope.layoutLoading) {
        $scope.layoutLoading = false;
      }
      // wijetsService.make();
    });
    $scope.change_Theme = function() {
      $theme.change_Theme();
    };
  }]);
