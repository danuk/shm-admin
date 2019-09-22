angular
.module('shm_console', [])
.service('shm_console', [ '$modal', '$q', '$timeout', function( $modal, $q, $timeout ) {
    this.log = function(data) {
        return $modal.open({
            templateUrl: 'views/console_log.html',
            controller: function ($scope, $modalInstance) {
                $scope.data = angular.copy(data);

                $scope.add = function() {
                    $scope.data.list_to.push( angular.copy( $scope.data.from ) );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: 'lg',
        });
    }

}])
.directive('console', [ 'shm_request', '$interval', function( shm_request, $interval ) {
    return {
        restrict: 'E',
        scope: {
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {

            var request = 'admin/console.cgi?id=' + $scope.id;

            shm_request('GET', request).then(function(response) {
                var log = response.data;

                if (!log) return;

                console.log( response );

                $element.append( log + "<br>" );

                $element.append( "Foo<br>" );
                $element.append( "bar<br>" );
                $element.append( "QAZ<br>" );

            });

            /*var timerId = $interval(function() {
                $element.append( "123<br>" );
            }, 1000);*/
        },
    }
}])
;

