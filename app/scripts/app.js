angular
  .module('themesApp', [
    'theme',
    'shm_table',
    'shm_table_tree',
    'shm_user',
    'shm_users_list',
    'shm_users_select',
    'shm_user_services',
    'shm_services_select',
    'shm_user_services_select',
    'shm_templates_select',
    'shm_events_select',
    'shm_pay_systems_select',
    'shm_templates',
    'shm_config',
    'shm_profiles',
    'shm_services',
    'shm_servers',
    'shm_servers_groups',
    'shm_spool',
    'shm_spool_history',
    'shm_events_us',
    'shm',
    'shm_request',
    'shm_console',
    'shm_json_editor',
    'shm_identities',
    'shm_withdraws',
    'shm_pays',
    'shm_bonuses',
  ])
  .config(['$provide', '$routeProvider', function($provide, $routeProvider) {
    'use strict';
    $routeProvider
      .when('/', {
        templateUrl: 'views/users.html',
      })
      .when('/:templateFile', {
        templateUrl: function(param) {
          return 'views/' + param.templateFile + '.html';
        }
      })
      .when('#', {
        templateUrl: 'views/users.html',
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
