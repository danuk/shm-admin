angular
  .module('shm_dashboard', [
  ])
  .controller('DashboardController', ['$scope', 'shm_request', function($scope, shm_request) {
    'use strict';
    
    shm_request('GET_JSON', '/stats.cgi' ).then(function(response) {
       $scope.data = response.data.data;
       $scope.loading = true;
    });

    $scope.selectedPeriod = 'all';

    $scope.selectPeriod = function(period) {
        $scope.selectedPeriod = period;
    };

    $scope.getDelta = function( item ) {
        const p = $scope.selectedPeriod;
        return $scope.data?.[item]?.[p]?.percent || 0;
    };

    $scope.getSign = function( item ) {
        const val = $scope.getDelta( item );
        if (val > 0) return '+';
        if (val < 0) return '-';
        return '';
    };

    $scope.getPeriodName = function() {
        const p = $scope.selectedPeriod;
        if (p == 'day') return {name: 'День', p: p};
        if (p == 'month') return {name: 'Месяц', p: p};
        if (p == 'month_3') return {name: '3 Месяца', p: p};
        if (p == 'year') return {name: 'Год', p: p};
        if (p == 'all') return {name: 'Все время', p: p};
    };
  }]);

