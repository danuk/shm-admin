angular
.module('shm_table', [
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.resizeColumns',
        'ui.grid.autoResize',
        'ui.grid.pagination',
        'ui.grid.moveColumns',
        'ui.grid.pinning',
        'ui.grid.cellNav',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.saveState',
    ])
    .controller('ShmTableController',
        ['$scope', '$q', '$filter', '$timeout', 'shm_request', '$window',
            function($scope, $q, $filter, $timeout, shm_request, $window) {
        'use strict';

        let restore = false

        window.onresize = function(event) {
            $scope.shmTableHeight = window.innerHeight - 250;
        };
        window.onresize();

        var paginationOptions = {
            offset: 0,
            limit: 50,
        };

        var delay_request = false;

        $scope.gridScope = $scope;

        $scope.gridOptions = {
            enableFiltering: true,
            enableCellEdit: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableGridMenu: true,
            noUnselect: true,
            gridMenuCustomItems: [
                {
                    title: 'Reload',
                    action: function ($event) {
                        $scope.load_data($scope.url);
                    },
                    order: 210
                }
            ],
            useExternalPagination: true,
            paginationPageSizes: [50, 100, 500, 1000, 2000, 5000],
            paginationPageSize: paginationOptions.limit,
        };

        $scope.saveRow = function( rowEntity ) {
            var promise = $q.defer();
            $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
            promise.resolve();
        };

        $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.filterChanged($scope, function() {
                if ( !delay_request ) {
                    delay_request = true;
                    $timeout(function() {
                        delay_request = false;
                        $scope.load_data($scope.url);
                    },1000);
                }
            });

            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                    delete paginationOptions.sort_field;
                    delete paginationOptions.sort_direction;
                } else {
                    paginationOptions.sort_field = sortColumns[0].field;
                    paginationOptions.sort_direction = sortColumns[0].sort.direction;
                }
                $scope.load_data($scope.url);
            });

            gridApi.pagination.on.paginationChanged($scope, function (pageNum, pageSize) {
                saveState();
                paginationOptions.offset = ( pageNum -1 ) * pageSize ;
                paginationOptions.limit = pageSize;
                $scope.load_data($scope.url);
            });

            gridApi.pinning.pinColumn($scope, saveState);
            gridApi.core.on.sortChanged($scope, saveState);
            gridApi.core.on.filterChanged($scope, saveState);
            gridApi.pinning.on.columnPinned($scope, saveState);
            gridApi.core.on.columnVisibilityChanged($scope, saveState);
            gridApi.colResizable.on.columnSizeChanged($scope, saveState);
            gridApi.colMovable.on.columnPositionChanged($scope, saveState);

            restoreState();
        };

        function saveState() {
            if ($scope.gridOptions.columnDefs && $scope.gridOptions.columnDefs.length > 0) {
                var state = $scope.gridApi.saveState.save();
                $window.localStorage[$scope.url] = JSON.stringify(state);
            }
        }
        function restoreState() {
            $timeout(function() {
                var state = JSON.parse($window.localStorage[$scope.url] || '{}');
                let user = $scope.user;

                if (state && state.columns) {
                    state.columns = state.columns.map(function(column) {
                        if ( user && column.name === 'user_id' && $scope.url === 'v1/admin/user') {
                            column.filters = [{}];
                        } else if ( user && column.name === 'user_id') {
                            column.filters = [{ term: user.user_id }];
                        } else if (column.name === 'user_id') {
                            column.filters = [{ }];
                        }
                        return column;
                    });
                }

                if (state && state.columns && state.columns.length > 0 && $scope.gridOptions.columnDefs) {
                    $scope.gridApi.saveState.restore($scope, state);
                }
            }, 0);
        }

        if ( $scope.row_dbl_click ) {
            $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.appScope.row_dbl_click(row.entity)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div>';
        }

        $scope.load_data = function(url, restore) {

            var filteringData = {};
            if ( $scope.defaultFilter ) { filteringData = angular.copy( $scope.defaultFilter ); $scope.defaultFilter = {} };
            angular.forEach( $scope.columnDefs, function( col ) {
                if ( col.filter && col.filter.term ) {
                    filteringData[col.field] = '%'+ col.filter.term +'%';
                }
            });

            var args = angular.merge(
                $scope.args || {},
                paginationOptions,
                {
                    filter: angular.toJson( filteringData ),
                },
            );

            shm_request('GET', url, args).then(function(response) {
                var largeLoad = response.data.data;

                if ( $scope.columnDefs ) {
                    var row = largeLoad[0];
                    for ( var field in row ) {
                        var found = 0;
                        $scope.columnDefs.forEach(function(item) {
                            if ( item.field == field ) { found = 1; return; };
                        });

                        if ( !found ) {
                            var col = {
                                field: field,
                                visible: false,
                                filter: {},
                            };
                            if ( filteringData[field]!=undefined ) ( col.filter.term = filteringData[field] );
                            $scope.columnDefs.push( col );
                        };
                    }
                    $scope.gridOptions.columnDefs = $scope.columnDefs;
                }
                if ( restore ){
                    restoreState();
                }
                $scope.setPagingData(largeLoad, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize );
                $scope.gridOptions.totalItems = response.data.items;
            })
        }

        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSize: 1000,
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
        $scope.getPagedDataAsync = function(url,pageSize, page, searchText) {
            setTimeout(function() {
                var data;
                if (searchText) {
                    /*var ft = searchText.toLowerCase();
                    shm_request('GET','/'+url).then(function(response) {
                        data = largeLoad.filter(function(item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                            });
                        $scope.setPagingData(data, page, pageSize);
                    });*/
                } else {
                     shm_request('GET', url).then(function(response) {
                         var largeLoad = response.data;
                         $scope.setPagingData(largeLoad, page, pageSize);
                     });
                }
            }, 100);
        };

        //$scope.getPagedDataAsync($scope.url, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        $scope.load_data($scope.url, restore = true);

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
    }])
    .directive('shmTable', function() {
        return {
            controller: 'ShmTableController',
            template: '<div ng-style="{height: shmTableHeight + \'px\'}" ui-grid="gridOptions" ui-grid-edit ui-grid-row-edit ui-grid-selection ui-grid-resize-columns ui-grid-auto-resize ui-grid-move-columns ui-grid-pinning ui-grid-pagination ui-grid-save-state></div>',
        }
    });

