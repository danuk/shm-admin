angular
  .module('shm_stats', [])
  .service('shm_stats', ['$q', 'shm_request', function($q, shm_request) {
    this.getDashboard = function(period, forceRefresh) {
      var params = period ? { period: period } : {};
      if (forceRefresh) {
        params.force_refresh = 1;
      }
      return shm_request('GET', 'v1/admin/stats', params);
    };
  }])
.controller('ShmStatsController', ['$scope', '$window', '$interval', 'shm_stats', function($scope, $window, $interval, shm_stats) {
    'use strict';

    $scope.Math = window.Math;
    $scope.loading = true;
    $scope.refreshing = false;
    $scope.stats = {};
    $scope.selectedPeriod = 'all';
    $scope.lastUpdate = new Date();
    
    $scope.autoRefresh = $window.localStorage['dashboard.autoRefresh'] === 'true' || 
                        $window.localStorage['dashboard.autoRefresh'] === null || 
                        $window.localStorage['dashboard.autoRefresh'] === undefined;
    
    $scope.refreshInterval = parseInt($window.localStorage['dashboard.refreshInterval']) || 30;

    $scope.periods = [
        { key: 'day', label: 'Сегодня' },
        { key: 'week', label: 'Неделя' },
        { key: 'month', label: 'Месяц' },
        { key: 'all', label: 'Все время' }
    ];

    $scope.refreshIntervals = [
        { value: 10, label: '10 секунд' },
        { value: 30, label: '30 секунд' },
        { value: 60, label: '1 минута' },
        { value: 120, label: '2 минуты' },
        { value: 300, label: '5 минут' },
        { value: 600, label: '10 минут' }
    ];

    var refreshIntervalHandle;

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

    $scope.loadStats = function(forceRefresh) {
        if (forceRefresh) {
            $scope.refreshing = true;
        } else {
            $scope.loading = true;
        }
        
        shm_stats.getDashboard($scope.selectedPeriod, forceRefresh).then(function(response) {
            $scope.stats = response.data.data[0];
            $scope.lastUpdate = new Date();
            $scope.loading = false;
            $scope.refreshing = false;
        }).catch(function(error) {
            console.error('Ошибка загрузки статистики:', error);
            $scope.loading = false;
            $scope.refreshing = false;
        });
    };

    $scope.forceRefresh = function() {
        $scope.loadStats(true);
    };

    $scope.changePeriod = function(period) {
        $scope.selectedPeriod = period;
        $scope.loadStats();
    };

    $scope.toggleAutoRefresh = function() {
        $scope.autoRefresh = !$scope.autoRefresh;
        if ($scope.autoRefresh) {
            $scope.startAutoRefresh();
            $window.localStorage['dashboard.autoRefresh'] = 'true';
        } else {
            $scope.stopAutoRefresh();
            $window.localStorage['dashboard.autoRefresh'] = 'false';
        }
    };

    $scope.changeRefreshInterval = function() {
        $window.localStorage['dashboard.refreshInterval'] = $scope.refreshInterval.toString();
        if ($scope.autoRefresh) {
            $scope.startAutoRefresh();
        }
    };

    $scope.startAutoRefresh = function() {
        if (refreshIntervalHandle) {
            $interval.cancel(refreshIntervalHandle);
        }
        refreshIntervalHandle = $interval(function() {
            $scope.loadStats(false);
        }, $scope.refreshInterval * 1000);
    };

    $scope.stopAutoRefresh = function() {
        if (refreshIntervalHandle) {
            $interval.cancel(refreshIntervalHandle);
            refreshIntervalHandle = null;
        }
    };
    
    $scope.$on('$destroy', function() {
        $scope.stopAutoRefresh();
    });

    $scope.loadStats();
    if ($scope.autoRefresh) {
        $scope.startAutoRefresh();
    }
}]);