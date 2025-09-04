angular
  .module('shm_stats', [])
  .service('shm_stats', ['$q', 'shm_request', function($q, shm_request) {
    this.getDashboard = function(period) {
      var params = period ? { period: period } : {};
      return shm_request('GET', 'v1/admin/stats', params);
    };
  }])
.controller('ShmStatsController', ['$scope', '$interval', 'shm_stats', function($scope, $interval, shm_stats) {
    'use strict';

    $scope.Math = window.Math;
    $scope.loading = true;
    $scope.stats = {};
    $scope.selectedPeriod = 'day';
    $scope.lastUpdate = new Date();
    
    $scope.periods = [
        { key: 'day', label: 'Сегодня' },
        { key: 'week', label: 'Неделя' },
        { key: 'month', label: 'Месяц' },
        { key: 'all', label: 'Все время' }
    ];

    $scope.getPeriodLabel = function() {
        var period = $scope.periods.find(p => p.key === $scope.selectedPeriod);
        return period ? period.label.toLowerCase() : 'период';
    };

    $scope.getStatusClass = function(status) {
        var classes = {
            'ACTIVE': 'progress-bar-success',
            'BLOCK': 'progress-bar-danger',
            'NOT PAID': 'progress-bar-warning',
            'DISABLED': 'progress-bar-default'
        };
        return classes[status] || 'progress-bar-info';
    };

    $scope.loadStats = function() {
        $scope.loading = true;
        shm_stats.getDashboard($scope.selectedPeriod).then(function(response) {
            $scope.stats = response.data.data[0];
            $scope.lastUpdate = new Date();
            $scope.loading = false;
        }).catch(function(error) {
            console.error('Ошибка загрузки статистики:', error);
            $scope.loading = false;
        });
    };

    $scope.changePeriod = function(period) {
        $scope.selectedPeriod = period;
        $scope.loadStats();
    };

    var refreshInterval = $interval($scope.loadStats, 30000);
    
    $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
    });

    $scope.loadStats();
}]);