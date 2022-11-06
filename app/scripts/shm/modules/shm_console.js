angular
.module('shm_console', [])
.service('shm_console', [ '$modal', '$q', '$timeout', function( $modal, $q, $timeout ) {
    this.log = function(id) {
        return $modal.open({
            templateUrl: 'views/console_log.html',
            controller: function ($scope, $modalInstance) {
                $scope.id = angular.copy(id);

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

            var timerId;
            var destroyed = 0;
            var offset = 1;

            var get_logs = function() {
                shm_request('GET', 'admin/console.cgi', { id: $scope.id, offset: offset } ).then(function(response) {
                    var log = response.data;

                    if ( log ) {
                        offset += log.length;

                        var text = log.replace( /\n\r?|\r\n?/g, '<br/>' );
                        $element.append( text );

                        // AutoScroll
                        var parentElement = $element.context.parentElement;
                        parentElement.scrollTop = parentElement.scrollHeight;
                    }

                    if ( response.headers('x-console-eof') == '0' && !destroyed ) {
                        timerId = $timeout(function() {
                            get_logs();
                        }, 1000);
                    } else {
                        angular.element( document.getElementById("loading") ).remove();
                    }
                });
            }

            get_logs();
            $element.append('<div><img id="loading" src="/images/loading.gif" style="width: 30px; margin: 10px; position: absolute; bottom: 0; right: 0"></div>');

            $scope.$on( "$destroy", function() {
                destroyed = 1;
                if ( timerId ) { $timeout.cancel( timerId ) };
            });
        },
    }
}])
;

