angular
  .module('shm_monaco_editor', ['monaco_custom_languages', 'template_variables'])
  .directive('monacoEditor', ['$timeout', 'MonacoLanguageLoader', 'TemplateVariables', function($timeout, MonacoLanguageLoader, TemplateVariables) {
    return {
      restrict: 'E',
      template: '<div style="height: 400px; border: 1px solid #ccc;"></div>',
      scope: {
        ngModel: '=',
        language: '@',
        theme: '@',
        options: '='
      },
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var editor;
        var editorElement = element.find('div')[0];
        var isMonacoLoaded = false;

        function initializeEditor() {
          if (typeof monaco === 'undefined') {
            return;
          }

          var defaultOptions = {
            value: scope.ngModel || '',
            language: scope.language || 'plaintext',
            theme: scope.theme || 'vs',
            automaticLayout: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            find: {
              addExtraSpaceOnTop: false,
              autoFindInSelection: 'never',
              seedSearchStringFromSelection: 'never'
            },
            fontSize: 14,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'boundary',
            showUnused: false,
            contextmenu: true,
            'bracketPairColorization.enabled': true,
            'bracketPairColorization.independentColorPoolPerBracketType': true,
            guides: {
              bracketPairs: true,
              bracketPairsHorizontal: true,
              highlightActiveIndentation: true,
              indentation: true
            },
            suggest: {
              showDetails: true,
              showDocumentation: true,
              preview: true,
              previewMode: 'prefix',
              insertMode: 'replace',
              filterGraceful: true,
              snippetsPreventQuickSuggestions: false,
              localityBonus: true,
              shareSuggestSelections: false,
              showIcons: true,
              maxVisibleSuggestions: 12,
              showStatusBar: true
            }
          };

          var editorOptions = angular.extend({}, defaultOptions, scope.options || {});
          
          editor = monaco.editor.create(editorElement, editorOptions);

          monaco.languages.setLanguageConfiguration('template-toolkit', {
            wordPattern: /[\w\.\-]+/
          });
          
          monaco.languages.setLanguageConfiguration('html', {
            wordPattern: /[\w\.\-]+/
          });

          monaco.languages.setLanguageConfiguration('shell', {
            wordPattern: /[\w\.\-_${}]+/
          });

          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: false,
            schemas: [],
            enableSchemaRequest: false,
            schemaRequest: 'ignore',
            schemaValidation: 'error',
            comments: 'error',
            trailingCommas: 'error'
          });

          monaco.languages.registerDocumentFormattingEditProvider('template-toolkit', {
            provideDocumentFormattingEdits: function() {
              return [];
            }
          });

          function validateTemplateToolkit(model) {
            var markers = [];
            var text = model.getValue();
            var lines = text.split('\n');
            var inTTDirective = false;
            var betweenDirectives = false;
            var jsonBlockDepth = 0;

            for (var i = 0; i < lines.length; i++) {
              var originalLine = lines[i];
              var line = originalLine.trim();

              if (line.includes('<%')) {
                inTTDirective = true;
                betweenDirectives = false;
              }
              if (line.includes('%>')) {
                inTTDirective = false;
                betweenDirectives = true;
                jsonBlockDepth = 0;
              }
              
              if (!line || inTTDirective) {
                continue;
              }
              
              if (betweenDirectives) {
                var openBraces = (line.match(/\{/g) || []).length;
                var closeBraces = (line.match(/\}/g) || []).length;
                var openBrackets = (line.match(/\[/g) || []).length;
                var closeBrackets = (line.match(/\]/g) || []).length;
                
                jsonBlockDepth += openBraces - closeBraces + openBrackets - closeBrackets;
                
                var isJsonProperty = line.match(/^\s*"[\w_]+"\s*:/);
                var isArrayElement = line.match(/^\s*\]/);
                var hasTTBlocks = line.includes('{{') || line.includes('}}');
                
                if (jsonBlockDepth > 0 && (isJsonProperty || isArrayElement) && !hasTTBlocks) {
                  var nextLineIndex = i + 1;
                  var needsComma = false;
                  
                  while (nextLineIndex < lines.length) {
                    var nextLine = lines[nextLineIndex].trim();
                    if (!nextLine) {
                      nextLineIndex++;
                      continue;
                    }
                    
                    if (nextLine.match(/^\s*"[\w_]+"\s*:/)) {
                      needsComma = true;
                    }
                    else if (nextLine.match(/^\s*[\}\]]/)) {
                      needsComma = false;
                    }
                    else if (nextLine.match(/^\s*\[/)) {
                      needsComma = true;
                    }
                    else if (nextLine.match(/^\s*\{/)) {
                      needsComma = true;
                    }
                    break;
                  }
                  
                  if (needsComma && !line.endsWith(',') && !line.endsWith('{') && !line.endsWith('[')) {
                    var lineLength = originalLine.length;
                    markers.push({
                      severity: monaco.MarkerSeverity.Error,
                      message: 'В JSON после свойства должна быть запятая',
                      startLineNumber: i + 1,
                      startColumn: lineLength,
                      endLineNumber: i + 1,
                      endColumn: lineLength + 1
                    });
                  }
                }
              }
            }
            monaco.editor.setModelMarkers(model, 'template-toolkit', markers);
          }
          scope.$watch('language', function(newLanguage) {
            if (editor && newLanguage === 'template-toolkit') {
              var model = editor.getModel();
              if (model) {
                validateTemplateToolkit(model);
                model.onDidChangeContent(function() {
                  validateTemplateToolkit(model);
                });
              }
            }
          });

          function registerCompletionProviders() {
            
            function analyzeTemplateContext(textUntilPosition, model, position) {
              var isInCurlyBraces = textUntilPosition.lastIndexOf('{{') > textUntilPosition.lastIndexOf('}}');
              var isInAngleBrackets = textUntilPosition.lastIndexOf('<%') > textUntilPosition.lastIndexOf('%>');
              
              var patterns = [
                /"[^"]*\{\{[^}]*$/,
                /'[^']*\{\{[^}]*$/,
                /`[^`]*\{\{[^}]*$/,
                /=[^=]*\{\{[^}]*$/,
                /:"[^"]*\{\{[^}]*$/,
                /'[^']*<%[^%]*$/,
                /"[^"]*<%[^%]*$/,
                /=[^=]*<%[^%]*$/
              ];
              
              var isInQuotedContext = patterns.some(function(pattern) {
                return pattern.test(textUntilPosition);
              });
              
              var textAfterPosition = '';
              var needsClosing = '';
              
              if (model && position) {
                var lineContent = model.getLineContent(position.lineNumber);
                textAfterPosition = lineContent.substring(position.column - 1);
                
                if (isInCurlyBraces && !textAfterPosition.startsWith('}}')) {
                  needsClosing = '}}';
                } else if (isInAngleBrackets && !textAfterPosition.startsWith('%>')) {
                  needsClosing = '%>';
                }
              }
              
              var context = (isInCurlyBraces || isInAngleBrackets || isInQuotedContext) ? 'inside_braces' : 'full';
              
              return {
                context: context,
                needsClosing: needsClosing
              };
            }
            
            monaco.languages.registerCompletionItemProvider('template-toolkit', {
              provideCompletionItems: function(model, position) {
                return new Promise(function(resolve) {
                  var textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                  });
                  
                  var contextInfo = analyzeTemplateContext(textUntilPosition, model, position);
                  
                  TemplateVariables.getContextualCompletions(contextInfo.context).then(function(suggestions) {
                    if (contextInfo.needsClosing) {
                      suggestions = suggestions.map(function(suggestion) {
                        return angular.extend({}, suggestion, {
                          insertText: suggestion.insertText + contextInfo.needsClosing
                        });
                      });
                    }
                    
                    resolve({ suggestions: suggestions });
                  }).catch(function(error) {
                    resolve({ suggestions: [] });
                  });
                });
              }
            });
            
            monaco.languages.registerCompletionItemProvider('html', {
              provideCompletionItems: function(model, position) {
                return new Promise(function(resolve) {
                  var textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                  });
                  
                  var contextInfo = analyzeTemplateContext(textUntilPosition, model, position);
                  
                  if (contextInfo.context !== 'none') {
                    TemplateVariables.getContextualCompletions(contextInfo.context).then(function(suggestions) {
                      if (contextInfo.needsClosing) {
                        suggestions = suggestions.map(function(suggestion) {
                          return angular.extend({}, suggestion, {
                            insertText: suggestion.insertText + contextInfo.needsClosing
                          });
                        });
                      }
                      
                      resolve({ suggestions: suggestions });
                    }).catch(function(error) {
                      resolve({ suggestions: [] });
                    });
                  } else {
                    resolve({ suggestions: [] });
                  }
                });
              }
            });

            monaco.languages.registerCompletionItemProvider('shell', {
              triggerCharacters: ['.', '_', '$', '{'],
              provideCompletionItems: function(model, position) {
                return new Promise(function(resolve) {
                  var textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                  });
                  
                  var contextInfo = analyzeTemplateContext(textUntilPosition, model, position);
                  
                  TemplateVariables.getContextualCompletions(contextInfo.context).then(function(suggestions) {
                    if (contextInfo.needsClosing) {
                      suggestions = suggestions.map(function(suggestion) {
                        return angular.extend({}, suggestion, {
                          insertText: suggestion.insertText + contextInfo.needsClosing
                        });
                      });
                    }
                    
                    var shellSuggestions = [];
                    if (contextInfo.context === 'none') {
                      shellSuggestions = [
                        {
                          label: 'echo',
                          kind: monaco.languages.CompletionItemKind.Keyword,
                          insertText: 'echo "${1:text}"',
                          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          detail: 'Вывод текста',
                          documentation: {
                            value: 'Вывод текста на экран',
                            isTrusted: true
                          }
                        },
                        {
                          label: 'if',
                          kind: monaco.languages.CompletionItemKind.Snippet,
                          insertText: 'if [ ${1:condition} ]; then\n\t${2:commands}\nfi',
                          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          detail: 'Условное выражение',
                          documentation: {
                            value: 'Условное выражение if-then-fi',
                            isTrusted: true
                          }
                        }
                      ];
                    }
                    
                    var allSuggestions = shellSuggestions.concat(suggestions);
                    resolve({ suggestions: allSuggestions });
                  }).catch(function(error) {
                    resolve({ suggestions: [] });
                  });
                });
              }
            });

            monaco.languages.registerCompletionItemProvider('json', {
              triggerCharacters: ['.', '"', '{', '['],
              provideCompletionItems: function(model, position) {
                return new Promise(function(resolve) {
                  var textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                  });
                  
                  var contextInfo = analyzeTemplateContext(textUntilPosition, model, position);
                  
                  if (contextInfo.context !== 'none') {
                    TemplateVariables.getContextualCompletions(contextInfo.context).then(function(suggestions) {
                      if (contextInfo.needsClosing) {
                        suggestions = suggestions.map(function(suggestion) {
                          return angular.extend({}, suggestion, {
                            insertText: suggestion.insertText + contextInfo.needsClosing
                          });
                        });
                      }
                      
                      resolve({ suggestions: suggestions });
                    }).catch(function(error) {
                      resolve({ suggestions: [] });
                    });
                  } else {
                    resolve({ suggestions: [] });
                  }
                });
              }
            });

            monaco.languages.registerCompletionItemProvider('plaintext', {
              triggerCharacters: ['.', '_', '{'],
              provideCompletionItems: function(model, position) {
                return new Promise(function(resolve) {
                  var textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                  });
                  
                  var contextInfo = analyzeTemplateContext(textUntilPosition, model, position);
                  
                  if (contextInfo.context !== 'none') {
                    TemplateVariables.getContextualCompletions(contextInfo.context).then(function(suggestions) {
                      if (contextInfo.needsClosing) {
                        suggestions = suggestions.map(function(suggestion) {
                          return angular.extend({}, suggestion, {
                            insertText: suggestion.insertText + contextInfo.needsClosing
                          });
                        });
                      }
                      
                      resolve({ suggestions: suggestions });
                    }).catch(function(error) {
                      resolve({ suggestions: [] });
                    });
                  } else {
                    resolve({ suggestions: [] });
                  }
                });
              }
            });
          }

          editor.onDidChangeModelContent(function() {
            var value = editor.getValue();
            if (value !== scope.ngModel) {
              $timeout(function() {
                ngModelCtrl.$setViewValue(value);
              }, 0, false);
            }
          });

          scope.$watch('ngModel', function(newValue) {
            if (editor && newValue !== editor.getValue()) {
              editor.setValue(newValue || '');
            }
          });

          scope.$watch('language', function(newLanguage) {
            if (editor && newLanguage) {
              var model = editor.getModel();
              if (model) {
                monaco.editor.setModelLanguage(model, newLanguage);
              }
            }
          });

          scope.$watch('theme', function(newTheme) {
            if (editor && newTheme) {
              monaco.editor.setTheme(newTheme);
            }
          });

          $timeout(function() {
            if (editor && scope.language) {
              var model = editor.getModel();
              if (model) {
                monaco.editor.setModelLanguage(model, scope.language);
              }
            }
          }, 100);

          $timeout(function() {
            if (monaco && monaco.languages) {
              registerCompletionProviders();
            }
          }, 200);

          isMonacoLoaded = true;
        }

        function loadMonaco() {
          if (typeof monaco !== 'undefined') {
            initializeEditor();
            return;
          }

          if (window.monacoLoading) {
            var checkLoaded = setInterval(function() {
              if (typeof monaco !== 'undefined') {
                clearInterval(checkLoaded);
                initializeEditor();
              }
            }, 100);
            return;
          }

          window.monacoLoading = true;

          var script = document.createElement('script');
          script.src = '/node_modules/monaco-editor/min/vs/loader.js';
          script.onload = function() {
            require.config({ 
              paths: { 
                'vs': '/node_modules/monaco-editor/min/vs' 
              } 
            });
            
            require(['vs/editor/editor.main'], function() {
              MonacoLanguageLoader.registerCustomLanguages();
              window.monacoLoading = false;
              $timeout(initializeEditor, 0);
            });
          };
          
          script.onerror = function() {
            window.monacoLoading = false;
          };
          
          document.head.appendChild(script);
        }

        loadMonaco();

        scope.$on('$destroy', function() {
          if (editor) {
            editor.dispose();
          }
        });
      }
    };
  }]);
