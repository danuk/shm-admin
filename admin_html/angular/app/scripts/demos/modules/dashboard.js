angular.module('theme.demos.dashboard', [
    'angular-skycons',
    'angular-chartist',
    'theme.chart.canvas',
    'theme.demos.forms',
    'theme.demos.tasks'
  ])
  .controller('DashboardController', ['$scope', '$theme', '$timeout', '$window', function($scope, $theme, $timeout, $window) {
    'use strict';

    // EasyPieChart

        try {
            $scope.designprogress = {
                barColor: "#ef9a9a",
                trackColor: 'rgba(255, 255, 255, 0.32)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 128,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent-non').text(Math.round(percent));
                }
            };

            $scope.codingprogress = {
                barColor: "#80deea",
                trackColor: 'rgba(255, 255, 255, 0.32)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 128,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent-non').text(Math.round(percent));
                }
            };

            $scope.docsprogress = {
                barColor: "#c5e1a5",
                trackColor: 'rgba(255, 255, 255, 0.32)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 128,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent-non').text(Math.round(percent));
                }
            };

            $scope.sales = {
                barColor: "#cddc39",
                trackColor: 'rgba(255, 255, 255, 0.32)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 96,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent-non').text(Math.round(percent));
                }
            };


            $scope.dashboardVisitor = {
                barColor: "#4dd0e1",
                trackColor: 'rgba(0, 0, 0, 0.05)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 64,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            };
            $scope.dashboardPageview = {
                barColor: "#ff8a65",
                trackColor: 'rgba(0, 0, 0, 0.05)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 64,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            };
            $scope.dashboardItemsold = {
                barColor: "#9575cd",
                trackColor: 'rgba(0, 0, 0, 0.05)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 64,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            };
            $scope.dashboardEarning = {
                barColor: "#4db6ac",
                trackColor: 'rgba(0, 0, 0, 0.05)',
                scaleColor: false,
                scaleLength: 8,
                lineCap: 'square',
                lineWidth: 2,
                size: 64,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            };


        } catch(e) {}


    // Chartist

        $scope.chartistData1 = {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            series: [{
                label: 'Page Views',
                data: [{meta:'Page Views', value: 3},
                       {meta:'Page Views', value: 5},
                       {meta:'Page Views', value: 3},
                       {meta:'Page Views', value: 6},
                       {meta:'Page Views', value: 3},
                       {meta:'Page Views', value: 7},
                       {meta:'Page Views', value: 3},
                       {meta:'Page Views', value: 5},
                       {meta:'Page Views', value: 3},
                       {meta:'Page Views', value: 4},
                       {meta:'Page Views', value: 3},
                       {meta:'Page Views', value: 6}]
            },

            {
                label: 'Visitors',
                data: [{meta:'Visitors', value: 1},
                       {meta:'Visitors', value: 2},
                       {meta:'Visitors', value: 1},
                       {meta:'Visitors', value: 3},
                       {meta:'Visitors', value: 1},
                       {meta:'Visitors', value: 4},
                       {meta:'Visitors', value: 1},
                       {meta:'Visitors', value: 2},
                       {meta:'Visitors', value: 1},
                       {meta:'Visitors', value: 2},
                       {meta:'Visitors', value: 1},
                       {meta:'Visitors', value: 2}]
            }
            ]
        };

        $scope.chartistOptions1 = {
          height: 300,
          fullWidth: true,
          low: 0,
          high: 7,
          showArea: true,
          axisY: {
            onlyInteger: true,
            offset: 20
          },
          plugins: [
            $window.Chartist.plugins.tooltip()
          ]
        };

        $scope.chartistEvents1 = {
          draw: function(data) {
            if(data.type === 'point') {
                data.element.animate({
                  y1: {
                    begin: 100 * data.index,
                    dur: 2000,
                    from: data.y + 1000,
                    to: data.y,
                    easing: Chartist.Svg.Easing.easeOutQuint
                  },
                  y2: {
                    begin: 100 * data.index,
                    dur: 2000,
                    from: data.y + 1000,
                    to: data.y,
                    easing: Chartist.Svg.Easing.easeOutQuint
                  }
                });
            }

            if(data.type === 'line' || data.type === 'area') {
              data.element.animate({
                d: {
                  begin: 2000 * data.index,
                  dur: 2000,
                  from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                  to: data.path.clone().stringify(),
                  easing: Chartist.Svg.Easing.easeOutQuint
                }
              });
            }
          }
        };

        $scope.chartistData2 = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [{
                label: 'Sales',
                data: [{meta:'Sales', value: 2},
                       {meta:'Sales', value: 4},
                       {meta:'Sales', value: 3},
                       {meta:'Sales', value: 6},
                       {meta:'Sales', value: 2},
                       {meta:'Sales', value: 4},
                       {meta:'Sales', value: 3},
                       {meta:'Sales', value: 5},
                       {meta:'Sales', value: 1},
                       {meta:'Sales', value: 4},
                       {meta:'Sales', value: 2},
                       {meta:'Sales', value: 6}]
            }]
        };

        $scope.chartistOptions2 = {
          height: 258,
          lineSmooth: false,
          fullWidth: true,
          showArea: true,
          low: 0,
          high: 7,
          axisY: {
            onlyInteger: true,
            offset: 25,
            labelInterpolationFnc: function(value) {
              return '$' + value + 'K';
            }
          },
          plugins: [
            $window.Chartist.plugins.tooltip({prefix: "$", suffix: "000"})
          ]
        };

    // Chart.js

        $scope.radarData = {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        $scope.radarOptions = {
            showScale: true,
            scaleLineColor: "rgba(0,0,0,.05)",
            scaleLineWidth: 1,
            scaleShowLabels: false,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Open Sans', 'Helvetica', 'Arial', sans-serif",
            scaleFontSize: 11,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            responsive: false,
            maintainAspectRatio: true,
            showTooltips: true,
            customTooltips: false,
            tooltipFillColor: "rgba(0,0,0,0.8)",
            tooltipFontFamily: "'Open Sans', 'Helvetica', 'Arial', sans-serif",
            tooltipFontSize: 10,
            tooltipFontStyle: "normal",
            tooltipFontColor: "#fff",
            tooltipTitleFontFamily: "'Open Sans', 'Helvetica', 'Arial', sans-serif",
            tooltipTitleFontSize: 11,
            tooltipTitleFontStyle: "bold",
            tooltipTitleFontColor: "#fff",
            tooltipYPadding: 6,
            tooltipXPadding: 6,
            tooltipCaretSize: 8,
            tooltipCornerRadius: 2,
            tooltipXOffset: 10,
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
            multiTooltipTemplate: "<%= value %>",
        }
        // var ctx = document.getElementById("radarChart").getContext("2d");
        // var myRadarChart = new Chart(ctx).Radar(radarData, radarOptions);

  }]);