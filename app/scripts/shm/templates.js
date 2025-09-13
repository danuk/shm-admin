angular
  .module('shm_templates', ['template_variables']
  )
  .service('shm_templates', ['$q', '$modal', 'shm', 'shm_request', function($q, $modal, shm, shm_request) {
    var url = 'v1/admin/template';

    this.add = function($scope) {
        var deferred = $q.defer();

        this.edit('Создание шаблона', {}, $scope).result.then(function(new_data){
            deferred.resolve(new_data);
        }, function(cancel) {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.uploadFile = function($scope) {
        var deferred = $q.defer();

        this.uploadDialog('Загрузка шаблона из файла', $scope).result.then(function(new_data){
            deferred.resolve(new_data);
        }, function(cancel) {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.uploadDialog = function(title, scope) {
        return $modal.open({
            templateUrl: 'views/template_upload.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.title = title;
                $scope.data = {
                    id: '',
                    data: '',
                    settings: {}
                };
                $scope.uploadedFile = null;
                $scope.is_add = 1;

                $scope.id_pattern = '[A-Za-z0-9-_/]+';

                $scope.onFileSelect = function(files) {
                    if (files && files.length > 0) {
                        $scope.uploadedFile = files[0];
                        var reader = new FileReader();

                        reader.onload = function(e) {
                            $scope.$apply(function() {
                                var content = e.target.result;

                                content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                                $scope.data.data = content;

                                if (!$scope.data.id && $scope.uploadedFile.name) {
                                    var fileName = $scope.uploadedFile.name.replace(/\.[^/.]+$/, "");
                                    fileName = fileName.replace(/[^A-Za-z0-9-_/]/g, '_');
                                    $scope.data.id = fileName;
                                }
                            });
                        };

                        reader.readAsText($scope.uploadedFile);
                    }
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    if (!$scope.data.id || !$scope.data.data) {
                        alert('Заполните все обязательные поля');
                        return;
                    }

                    var requestData = angular.copy($scope.data);
                    requestData.is_add = $scope.is_add;

                    shm_request('PUT_JSON', url, requestData).then(function(response) {
                        $modalInstance.close(response.data.data[0]);
                    }).catch(function(error) {
                        alert('Ошибка при сохранении шаблона');
                    });
                };
            }],
            size: 'md',
        });
    };

    this.edit = function(title, row, scope) {
        return $modal.open({
            templateUrl: 'views/template_edit.html',
            controller: ['$scope', '$modalInstance', '$modal', '$window', '$document', 'TemplateVariables', function ($scope, $modalInstance, $modal, $window, $document, TemplateVariables) {
                $scope.title = title;
                $scope.data = {};
                $scope.data.is_add = row.id ? 0 : 1;

                $scope.editorOptions = {
                    fontSize: 14,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: 'on',
                    folding: true,
                    find: {
                        addExtraSpaceOnTop: false,
                        autoFindInSelection: 'never'
                    }
                };

                $scope.autoConvertToUnixLineEndings = function() {
                    if ($scope.data.data) {
                        var hasWindowsLineEndings = $scope.data.data.includes('\r');
                        if (hasWindowsLineEndings) {
                            $scope.data.data = $scope.data.data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                            return true;
                        }
                    }
                    return false;
                };

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

                $scope.detectCurrentTheme = detectCurrentTheme;

                $scope.editorTheme = $scope.detectCurrentTheme();

                $scope.updateEditorTheme = function() {
                    var baseTheme = $scope.detectCurrentTheme();

                    if ($scope.editorLanguage === 'template-toolkit') {
                        $scope.editorTheme = baseTheme === 'vs-dark' ? 'vs-dark-template-toolkit' : 'vs-template-toolkit';
                    } else {
                        $scope.editorTheme = baseTheme;
                    }
                };

                var storageListener = function(e) {
                    if (e.key === 'theme.settings.ThemeClass') {
                        $scope.$apply(function() {
                            $scope.updateEditorTheme();
                        });
                    }
                };

                window.addEventListener('storage', storageListener);

                $scope.$on('$destroy', function() {
                    window.removeEventListener('storage', storageListener);
                });
                $scope.detectLanguage = function(templateId, content) {
                    if (!content) return 'plaintext';

                    var trimmedContent = content.trim();

                    if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {

                        return 'json';
                    } else if (content.includes('#!/bin/bash') ||
                               content.includes('#!/bin/sh') ||
                               content.includes('#!/usr/bin/bash') ||
                               content.includes('#!/usr/bin/sh') ||
                               content.includes('set -e') ||
                               content.includes('echo ') ||
                               (content.includes('if [') && content.includes('then')) ||
                               content.includes('for i in') ||
                               content.includes('while [')) {

                        return 'shell';
                    } else if (content.includes('#!/usr/bin/perl') ||
                               content.includes('use strict;') ||
                               content.includes('package ') ||
                               content.includes('my $')) {

                        return 'perl';
                    } else if (content.includes('[%') || content.includes('%]') ||
                               content.includes('<%') || content.includes('%>') ||
                               content.includes('{{') || content.includes('}}')) {

                        return 'template-toolkit';
                    } else if (content.includes('<html') || content.includes('<!DOCTYPE') ||
                               content.includes('<head>') || content.includes('<body>') ||
                               content.includes('<div') || content.includes('<span')) {

                        return 'html';
                    }

                    return 'plaintext';
                };

                $scope.currentLanguage = null;
                $scope.editorLanguage = 'plaintext';

                $scope.setLanguage = function(language) {
                    $scope.currentLanguage = language;
                    if (language) {
                        $scope.editorLanguage = language;
                    } else {
                        $scope.updateEditorLanguage();
                    }
                    $scope.autoConvertToUnixLineEndings();
                };

                $scope.updateEditorLanguage = function() {
                    var detectedLang = $scope.detectLanguage($scope.data.id, $scope.data.data);
                    $scope.editorLanguage = $scope.currentLanguage || detectedLang;
                };

                $scope.$watch('data.id', function() {
                    if (!$scope.currentLanguage) {
                        $scope.updateEditorLanguage();
                    }
                });

                $scope.$watch('data.data', function() {
                    if (!$scope.currentLanguage) {
                        $scope.updateEditorLanguage();
                    }
                });

                $scope.$watch('editorLanguage', function() {
                    $scope.updateEditorTheme();
                });

                $scope.$watch('data.data', function(newValue, oldValue) {
                    if (newValue && newValue !== oldValue && newValue.includes('\r')) {
                        $scope.autoConvertToUnixLineEndings();
                    }
                });

                if ( row.id ) {
                    shm_request( 'GET', 'v1/admin/template?id='+ row.id ).then(function(response) {
                        angular.extend( $scope.data, response.data.data[0] );
                        $scope.editorLanguage = $scope.detectLanguage($scope.data.id, $scope.data.data);
                        $scope.autoConvertToUnixLineEndings();
                    });
                } else {
                    $scope.editorLanguage = 'plaintext';
                };

                $scope.id_pattern = '[A-Za-z0-9-_/]+';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function (is_test) {
                    $scope.autoConvertToUnixLineEndings();

                    shm_request( $scope.data.is_add ? 'PUT_JSON' : 'POST_JSON', url, $scope.data ).then(function(response) {
                        $scope.data.is_add = 0;
                        angular.extend( row, response.data.data[0] );
                        if (!is_test) $modalInstance.close( response.data.data[0] );
                    });
                };

                $scope.delete = function () {
                    if ( confirm('Удалить шаблон?') ) {
                        shm_request('DELETE', url, { id: row.id } ).then(function() {
                            $modalInstance.dismiss('delete');
                        })
                    }
                };

                $scope.test = function (template_id) {
                    $scope.save(1);
                    $modal.open({
                        templateUrl: 'views/template_test.html',
                        controller: function ($scope, $modalInstance, $modal) {
                            $scope.data = angular.copy(row);
                            $scope.data.user_id = scope.user.user_id || "1";
                            $scope.data.dry_run = 1;

                            $scope.close = function () {
                                $modalInstance.dismiss('close');
                            };

                            $scope.render = function () {
                                var args = {
                                    user_id: $scope.data.user_id,
                                    usi: $scope.data.usi,
                                    dry_run: $scope.data.dry_run + 0,
                                    format: 'default',
                                };
                                shm_request( 'GET', 'v1/template/'+ template_id, args ).then(function(response) {
                                    $scope.data.render = response.data.data[0];
                                });
                            };
                        },
                    });
                };
            }],
            size: 'lg',
        });
    };

  }])
  .controller('ShmTemplatesController', ['$scope', 'shm_templates', 'shm_request', function($scope, shm_templates, shm_request) {
    'use strict';

    var url = 'v1/admin/template';
    $scope.url = url;
    $scope.parent_key_id = 'id';

    $scope.columnDefs = [
        {
            field: 'id',
            width: "50%",
        },
        {
            field: 'settings',
            width: "50%",
        },
    ];

    $scope.add = function() {
        shm_templates.add($scope).then(function(data) {
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.uploadFile = function() {
        shm_templates.uploadFile($scope).then(function(data) {
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_templates.edit('Редактирование шаблона',row, $scope).result.then(function(data){
            angular.extend( row, data );
            delete row.$$treeLevel;
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);