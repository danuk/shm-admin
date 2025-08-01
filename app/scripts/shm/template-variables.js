angular
    .module('template_variables', [])
    .service('TemplateVariables', ['$http', function($http) {
        'use strict';

        var snippets = {};
        var isLoaded = false;

        this.loadSnippets = function() {
            if (isLoaded) {
                return Promise.resolve(snippets);
            }

            return $http.get('snippets/snippets.json').then(function(response) {
                snippets = response.data;
                isLoaded = true;
                return snippets;
            }).catch(function(error) {
                return {};
            });
        };

        this.getMonacoCompletions = function() {
            return this.loadSnippets().then(function(data) {
                var completions = [];

                Object.keys(data).forEach(function(key) {
                    var snippet = data[key];

                    var prefixes = Array.isArray(snippet.prefix) ? snippet.prefix : [snippet.prefix];

                    prefixes.forEach(function(prefix) {
                        var body = Array.isArray(snippet.body) ? snippet.body.join('\n') : String(snippet.body || '');
                        completions.push({
                            label: prefix,
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: body,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            detail: snippet.description || 'SHM Template Snippet',
                            documentation: {
                                value: snippet.description || 'SHM Template Snippet',
                                isTrusted: true
                            },
                            sortText: '0' + prefix,
                            filterText: prefix,
                            preselect: false
                        });
                    });
                });

                return completions;
            });
        };

        this.getContextualCompletions = function(context) {
            return this.loadSnippets().then(function(data) {
                var completions = [];

                Object.keys(data).forEach(function(key) {
                    var snippet = data[key];
                    if (!snippet || !snippet.prefix) {
                        return;
                    }

                    var prefixes = Array.isArray(snippet.prefix) ? snippet.prefix : [snippet.prefix];

                    prefixes.forEach(function(prefix) {
                        var completion = {
                            label: prefix,
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            detail: snippet.description || 'SHM Template',
                            documentation: {
                                value: snippet.description || 'SHM Template',
                                isTrusted: true
                            },
                            sortText: '0' + prefix,
                            filterText: prefix,
                            preselect: false
                        };

                        if (context === 'inside_braces') {
                            var body = Array.isArray(snippet.body) ? snippet.body.join('\n') : String(snippet.body || '');
                            body = body.replace(/^\{\{\s*/, '').replace(/\s*\}\}$/, '');
                            completion.insertText = body;
                        } else {
                            var body = Array.isArray(snippet.body) ? snippet.body.join('\n') : String(snippet.body || '');
                            completion.insertText = body;
                        }

                        completion.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
                        completions.push(completion);
                    });
                });

                return completions;
            });
        };

        this.searchSnippets = function(query) {
            return this.loadSnippets().then(function(data) {
                var results = [];
                query = query.toLowerCase();

                Object.keys(data).forEach(function(key) {
                    var snippet = data[key];
                    var prefixes = Array.isArray(snippet.prefix) ? snippet.prefix : [snippet.prefix];

                    prefixes.forEach(function(prefix) {
                        if (prefix.toLowerCase().includes(query) ||
                            snippet.description.toLowerCase().includes(query)) {
                            results.push({
                                label: prefix,
                                insertText: snippet.body,
                                detail: snippet.description,
                                documentation: snippet.description
                            });
                        }
                    });
                });

                return results;
            });
        };

        this.loadSnippets();
    }]);