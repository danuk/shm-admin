angular
  .module('themesApp', [
    'theme',
    'shm_table',
    'shm_table_tree',
    'shm_user',
    'shm_users_list',
    'shm_user_services',
    'shm_services',
    'shm_servers',
    'shm_servers_groups',
    'shm_spool',
    'shm_spool_history',
    'shm_categories',
    'angular-jsoneditor',
    'shm',
    'shm_request',
  ])
  .config(['$provide', '$routeProvider', function($provide, $routeProvider) {
    'use strict';
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
      })
      .when('/:templateFile', {
        templateUrl: function(param) {
          return 'views/' + param.templateFile + '.html';
        }
      })
      .when('#', {
        templateUrl: 'views/index.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  /*.directive('demoOptions', function () {
    return {
      restrict: 'C',
      link: function (scope, element, attr) {
        element.find('.demo-options-icon').click( function () {
          element.toggleClass('active');
        });
      }
    };
  })*/
