angular.module('shm_json_editor', [
    'angular-jsoneditor',
])
  .directive('jsonEditor', [ '$modal', function( $modal ) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      controller: function ($scope, $element, $attrs) {

        $scope.editJson = function() {
          var new_data = $scope.data;

          return $modal.open({
            templateUrl: 'views/shm/modules/json-editor/json-editor-form.html',
            controller: function ($scope, $modalInstance) {
              $scope.obj = {data: new_data, options: {mode: 'tree'}};
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
              $scope.save = function () {
                $modalInstance.close( $scope.obj.data );
              };
            },
            size: 'lg',
          })
          .result.then( function(json) {
            $scope.data = json;
          }, function(cancel) {});

        };

      },
      templateUrl: "views/shm/modules/json-editor/json-editor-button.html"
    }
  }])
;
