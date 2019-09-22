angular
.module('shm_console', [])
.service('shm_console', [ '$modal', '$q', '$timeout', function( $modal, $q, $timeout ) {
    this.log = function(data) {
        return $modal.open({
            templateUrl: 'views/console_log.html',
            controller: function ($scope, $modalInstance) {
                $scope.data = angular.copy(data);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: 'lg',
        });
    }

}])
.directive('console', [ 'shm_request', '$timeout', function( shm_request, $timeout ) {
    return {
        restrict: 'E',
        scope: {
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {

            var $timerId;
            var destroyed = 0;
            var offset = 1;

            var get_logs = function() {

                var request = 'admin/console.cgi?id=' + $scope.id + '&offset=' + offset;
                shm_request('GET', request).then(function(response) {
                    var log = response.data;

                    if ( log ) {
                        offset += log.length;

                        var text = log.replace( /\n\r?|\r\n?/g, '<br/>' );
                        $element.append( text );
                    }

                    if ( response.headers('x-console-eof') == '0' && !destroyed ) {
                        timerId = $timeout(function() {
                            get_logs();
                        }, 1000);
                    }
                });
            }

            get_logs();

            $scope.$on( "$destroy", function() {
                destroyed = 1;
                $timeout.cancel( timerId );
            });
        },
    }
}])
;

