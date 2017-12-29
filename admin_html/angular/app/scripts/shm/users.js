angular
  .module('shm_users', [
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.grid.moveColumns',
    'ui.grid.pinning',
    'ui.grid.cellNav',
  ])
  .controller('ShmUsersController', ['$scope', '$filter', '$http', function($scope, $filter, $http) {
    'use strict';

    $scope.gridScope = $scope;

    $scope.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      enableGridMenu: true,
      noUnselect: true, 
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      },
      rowTemplate: '<div ng-dblclick="grid.appScope.test(row.entity)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div>'

    };

    $scope.gridOptions.columnDefs = [
          {field: 'user_id', displayName: 'ID'},
          {field: 'login', displayName: 'Логин' },
          //{field: 'login', displayName: 'Логин', cellTemplate: '<button ng-click="grid.appScope.test(row.entity)" >Edit</button>'},
          {field: 'password', displayName: 'Пароль', visible: false},
          {field: 'full_name', displayName: 'Клиент'},
          {field: 'balance', displayName: 'Баланс'},
          {field: 'credit', displayName: 'Кредит'},
          {name: 'block'},
    ];

    $scope.test = function(row) {
        console.log( row );
    }
   
    $scope.filterOptions = {
      filterText: '',
      useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
      pageSizes: [25, 50, 100],
      pageSize: 25,
      currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize) {
      var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.gridOptions.data = pagedData;
      $scope.totalServerItems = data.length;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {
      setTimeout(function() {
        var data;
        if (searchText) {
          var ft = searchText.toLowerCase();
          $scope.http_request('GET','/admin/users.cgi').then(function(largeLoad) {
            data = largeLoad.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
            });
            $scope.setPagingData(data, page, pageSize);
          });
        } else {
          $scope.http_request('GET','/admin/users.cgi').then(function(largeLoad) {
            $scope.setPagingData(largeLoad, page, pageSize);

               //$scope.gridOptions.columnDefs = [
               //     {name: 'test', visible: false},
               //];
          });
        }
      }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
      if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

   
  }]);
