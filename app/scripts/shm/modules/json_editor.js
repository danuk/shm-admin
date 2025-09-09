angular.module('shm_json_editor', [
    'angular-jsoneditor',
    'shm_monaco_editor',
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
            controller: ['$scope', '$modalInstance', '$window', '$document', function ($scope, $modalInstance, $window, $document) {
              
              // Функция определения текущей темы
              function detectCurrentTheme() {
                var themeClass = $window.localStorage['theme.settings.ThemeClass'];
                if (themeClass === 'dark') {
                  return 'vs-dark';
                } else if (themeClass === 'light') {
                  return 'vs';
                }
                
                var computed = $window.getComputedStyle($document[0].documentElement);
                var bgColor = computed.getPropertyValue('--background-color').trim();
                
                if (bgColor === '#212121' || bgColor.includes('21212')) {
                  return 'vs-dark';
                }
                
                if ($document[0].body.classList.contains('dark')) {
                  return 'vs-dark';
                }
                
                return 'vs';
              }

              var currentTheme = detectCurrentTheme();
              var isDarkTheme = currentTheme === 'vs-dark';

              $scope.obj = {
                data: new_data, 
                options: {
                  mode: 'tree',
                  theme: isDarkTheme ? 'ace/theme/monokai' : 'ace/theme/github'
                }
              };
              $scope.editorType = 'json'; // 'json' или 'monaco'
              $scope.monacoOptions = {
                language: 'json',
                theme: currentTheme,
                automaticLayout: true,
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                fontSize: 14
              };

              // Функция обновления темы
              $scope.updateTheme = function() {
                var newTheme = detectCurrentTheme();
                var isDark = newTheme === 'vs-dark';
                
                // Обновляем тему для Monaco Editor
                $scope.monacoOptions.theme = newTheme;
                
                // Обновляем тему для JSON Editor
                $scope.obj.options.theme = isDark ? 'ace/theme/monokai' : 'ace/theme/github';
              };

              // Слушатель изменения темы
              var storageListener = function(e) {
                if (e.key === 'theme.settings.ThemeClass') {
                  $scope.$apply(function() {
                    $scope.updateTheme();
                  });
                }
              };

              $window.addEventListener('storage', storageListener);

              $scope.$on('$destroy', function() {
                $window.removeEventListener('storage', storageListener);
              });
              
              $scope.switch = function() {
                if ($scope.editorType === 'json') {
                  // Переключаемся на Monaco Editor
                  $scope.editorType = 'monaco';
                  $scope.monacoData = JSON.stringify($scope.obj.data, null, 2);
                } else {
                  // Переключаемся на JSON Editor
                  try {
                    $scope.obj.data = JSON.parse($scope.monacoData);
                    $scope.editorType = 'json';
                  } catch (e) {
                    alert('Ошибка в JSON: ' + e.message);
                  }
                }
              };
              
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
              
              $scope.save = function () {
                var dataToSave;
                if ($scope.editorType === 'monaco') {
                  try {
                    dataToSave = JSON.parse($scope.monacoData);
                  } catch (e) {
                    alert('Ошибка в JSON: ' + e.message);
                    return;
                  }
                } else {
                  dataToSave = $scope.obj.data;
                }
                $modalInstance.close(dataToSave);
              };
            }],
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
