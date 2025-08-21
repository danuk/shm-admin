angular
  .module('monaco_custom_languages', [])
  .factory('MonacoLanguageLoader', function() {
    
    var customLanguages = {
      'template-toolkit': {
        id: 'template-toolkit',
        aliases: ['Template Toolkit', 'tt', 'tt2'],
        extensions: ['.tt', '.tt2'],
        configuration: {
          comments: {
          },
          brackets: [
            ['<%', '%>'],
            ['{{', '}}'],
            ['(', ')'],
            ['{', '}'],
            ['[', ']']
          ],
          autoClosingPairs: [
            { open: '<%', close: '%>' },
            { open: '{{', close: '}}' },
            { open: '(', close: ')' },
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '"', close: '"' },
            { open: "'", close: "'" }
          ],
          surroundingPairs: [
            { open: '<%', close: '%>' },
            { open: '{{', close: '}}' },
            { open: '(', close: ')' },
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '"', close: '"' },
            { open: "'", close: "'" }
          ]
        },
        monarchLanguage: {
          defaultToken: 'invalid',
          tokenPostfix: '.tt',
          
          keywords: [
            'IF', 'UNLESS', 'ELSE', 'ELSIF', 'END', 'SWITCH', 'CASE',
            'FOREACH', 'FOR', 'WHILE', 'NEXT', 'LAST', 'RETURN', 'STOP',
            'SET', 'GET', 'CALL', 'DEFAULT', 'INSERT', 'INCLUDE', 'PROCESS',
            'WRAPPER', 'BLOCK', 'FILTER', 'USE', 'PLUGIN', 'MACRO', 'PERL',
            'RAWPERL', 'VIEW', 'META', 'TAGS', 'DEBUG', 'TRY', 'THROW', 'CATCH', 'FINAL',
            'IN', 'AND', 'OR', 'NOT', 'MOD', 'DIV'
          ],
          
          operators: [
            '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
            '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
            '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
            '%=', '<<=', '>>=', '>>>='
          ],
          
          symbols: /[=><!~?:&|+\-*\/\^%]+/,
          
          tokenizer: {
            root: [
              [/<%[-~]?/, { token: 'delimiter.tt', next: '@ttDirective' }],
              
              [/\{\{[-~]?/, { token: 'delimiter.expression', next: '@ttExpression' }],
              
              [/\{/, { token: 'delimiter.curly', next: '@jsonObject' }],
              [/\[/, { token: 'delimiter.square', next: '@jsonArray' }],
              
              [/<\/?[a-zA-Z][\w]*/, 'tag'],
              [/<[^>]+>/, 'tag'],
              
              [/<!--/, 'comment.html', '@htmlComment'],
              
              [/[^<\[{]+/, 'text']
            ],
            
            ttDirective: [
              [/#.*?(?=[-~]?%>|$)/, 'comment.tt'],
              
              [/"([^"\\]|\\.)*$/, 'string.invalid'],
              [/"/, 'string', '@ttString'],
              [/'([^'\\]|\\.)*$/, 'string.invalid'],
              [/'/, 'string', '@ttStringSingle'],
              
              [/[a-zA-Z_]\w*/, {
                cases: {
                  '@keywords': 'keyword.tt',
                  '@default': 'identifier.tt'
                }
              }],
              
              [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float.tt'],
              [/\d+/, 'number.tt'],
              
              [/@symbols/, {
                cases: {
                  '@operators': 'operator.tt',
                  '@default': ''
                }
              }],
              
              [/[a-zA-Z_]\w*(?=\s*\()/, 'function.tt'],
              [/[a-zA-Z_]\w*/, 'variable.tt'],
              
              [/[{}()\[\]]/, '@brackets.tt'],
              
              [/[;,.]/, 'delimiter.tt'],
              
              [/[-~]?%>/, { token: 'delimiter.tt', next: '@pop' }]
            ],
            
            ttExpression: [
              
              [/"([^"\\]|\\.)*$/, 'string.invalid'],
              [/"/, 'string', '@ttString'],
              [/'([^'\\]|\\.)*$/, 'string.invalid'],
              [/'/, 'string', '@ttStringSingle'],
              
              [/[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)*/, 'variable.tt'],
              
              [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float.tt'],
              [/\d+/, 'number.tt'],
              
              [/@symbols/, {
                cases: {
                  '@operators': 'operator.tt',
                  '@default': ''
                }
              }],
              
              [/[{}()\[\]]/, '@brackets.tt'],
              
              [/[;,.]/, 'delimiter.tt'],
              
              [/[-~]?\}\}/, { token: 'delimiter.expression', next: '@pop' }]
            ],
            
            jsonObject: [
              [/"[^"]*"/, 'key.json'],
              [/:/, 'delimiter.json'],
              [/"([^"\\]|\\.)*"/, 'string.json'],
              [/\{/, { token: 'delimiter.curly', next: '@jsonObject' }],
              [/\[/, { token: 'delimiter.square', next: '@jsonArray' }],
              [/\}/, { token: 'delimiter.curly', next: '@pop' }],
              [/[,]/, 'delimiter.json'],
              [/\d+/, 'number.json'],
              [/true|false|null/, 'keyword.json'],
              [/\s+/, '']
            ],
            
            jsonArray: [
              [/"([^"\\]|\\.)*"/, 'string.json'],
              [/\{/, { token: 'delimiter.curly', next: '@jsonObject' }],
              [/\[/, { token: 'delimiter.square', next: '@jsonArray' }],
              [/\]/, { token: 'delimiter.square', next: '@pop' }],
              [/[,]/, 'delimiter.json'],
              [/\d+/, 'number.json'],
              [/true|false|null/, 'keyword.json'],
              [/\s+/, '']
            ],
            
            ttString: [
              [/[^\\"]+/, 'string.tt'],
              [/\\./, 'string.escape.tt'],
              [/"/, 'string.tt', '@pop']
            ],
            
            ttStringSingle: [
              [/[^\\']+/, 'string.tt'],
              [/\\./, 'string.escape.tt'],
              [/'/, 'string.tt', '@pop']
            ],
            
            htmlComment: [
              [/[^<\-]+/, 'comment.html'],
              [/-->/, 'comment.html', '@pop'],
              [/[<\-]/, 'comment.html']
            ]
          }
        }
      },
      
      'shell': {
        id: 'shell',
        aliases: ['Shell', 'Bash', 'sh'],
        extensions: ['.sh', '.bash'],
        configuration: {
          comments: {
            lineComment: '#'
          },
          brackets: [
            ['(', ')'],
            ['{', '}'],
            ['[', ']']
          ],
          autoClosingPairs: [
            { open: '(', close: ')' },
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '`', close: '`' }
          ],
          surroundingPairs: [
            { open: '(', close: ')' },
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '`', close: '`' }
          ]
        },
        monarchLanguage: {
          defaultToken: 'source.shell',
          tokenPostfix: '.shell',
          
          keywords: [
            'if', 'then', 'else', 'elif', 'fi', 'case', 'esac',
            'for', 'in', 'while', 'until', 'do', 'done', 'function',
            'return', 'exit', 'break', 'continue', 'declare', 'local',
            'readonly', 'export', 'unset', 'shift', 'set', 'unalias',
            'alias', 'bind', 'builtin', 'caller', 'command', 'compgen',
            'complete', 'dirs', 'disown', 'echo', 'enable', 'exec',
            'fc', 'fg', 'getopts', 'hash', 'help', 'history', 'jobs',
            'kill', 'let', 'logout', 'popd', 'printf', 'pushd', 'pwd',
            'read', 'shopt', 'source', 'suspend', 'test', 'times',
            'trap', 'type', 'typeset', 'ulimit', 'umask', 'wait'
          ],
          
          operators: [
            '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!',
            '+', '-', '*', '/', '%', '<<', '>>', '&', '|', '^', '~'
          ],
          
          symbols: /[=><!~?:&|+\-*\/\^%]+/,
          
          tokenizer: {
            root: [
              [/^\s*#.*$/, 'comment.shell'],
              [/\s+#.*$/, 'comment.shell'],
              
              [/\$\{[^}]*\}/, 'variable.shell'],
              [/\$[a-zA-Z_][a-zA-Z0-9_]*/, 'variable.shell'],
              [/\$[0-9]+/, 'variable.shell'],
              [/\$[@*#?$!]/, 'variable.shell'],
              
              [/"([^"\\]|\\.)*"/, 'string.shell'],
              [/'([^'\\]|\\.)*'/, 'string.shell'],
              [/`([^`\\]|\\.)*`/, 'string.shell'],
              
              [/[a-zA-Z_][a-zA-Z0-9_]*/, {
                cases: {
                  '@keywords': 'keyword.shell',
                  '@default': 'identifier.shell'
                }
              }],
              
              [/\d+/, 'number.shell'],
              
              [/@symbols/, {
                cases: {
                  '@operators': 'operator.shell',
                  '@default': 'source.shell'
                }
              }],
              
              [/[(){}[\]]/, 'delimiter.shell'],
              
              [/\s+/, 'source.shell']
            ]
          }
        }
      }
    };
    
    return {
      registerCustomLanguages: function() {
        if (typeof monaco === 'undefined') {
          return false;
        }
        
        
        Object.keys(customLanguages).forEach(function(langId) {
          var lang = customLanguages[langId];
          
          
          if (langId === 'shell') {
            try {
              var existingLanguages = monaco.languages.getLanguages();
              var shellExists = existingLanguages.some(function(l) { return l.id === 'shell'; });
              if (shellExists) {
              }
            } catch (e) {
            }
          }
          
          try {
            monaco.languages.register({
              id: lang.id,
              aliases: lang.aliases,
              extensions: lang.extensions
            });
          } catch (e) {
          }
          
          if (lang.configuration) {
            try {
              monaco.languages.setLanguageConfiguration(lang.id, lang.configuration);
            } catch (e) {
            }
          }
          
          if (lang.monarchLanguage) {
            try {
              monaco.languages.setMonarchTokensProvider(lang.id, lang.monarchLanguage);
            } catch (e) {
            }
          }
        });
        

        monaco.editor.defineTheme('vs-template-toolkit', {
          base: 'vs',
          inherit: true,
          rules: [
            { token: 'delimiter.tt', foreground: '800080', fontStyle: 'bold' },
            { token: 'delimiter.expression', foreground: 'FF6600', fontStyle: 'bold' },
            { token: 'keyword.tt', foreground: '0000FF', fontStyle: 'bold' },
            { token: 'string.tt', foreground: 'A31515' },
            { token: 'string.json', foreground: 'A31515' },
            { token: 'key.json', foreground: '001080', fontStyle: 'bold' },
            { token: 'keyword.json', foreground: '0000FF' },
            { token: 'number.json', foreground: '098658' },
            { token: 'delimiter.json', foreground: '000000' },
            { token: 'comment.tt', foreground: '008000', fontStyle: 'italic' },
            { token: 'variable.tt', foreground: '001080' },
            { token: 'function.tt', foreground: '795E26' },
            { token: 'number.tt', foreground: '098658' },
            { token: 'operator.tt', foreground: '000000' },
            
            { token: 'source.shell', foreground: '000000' },
            { token: 'comment.shell', foreground: '008000', fontStyle: 'italic' },
            { token: 'keyword.shell', foreground: '0000FF', fontStyle: 'bold' },
            { token: 'string.shell', foreground: 'A31515' },
            { token: 'variable.shell', foreground: '001080', fontStyle: 'bold' },
            { token: 'number.shell', foreground: '098658' },
            { token: 'operator.shell', foreground: '000000' },
            { token: 'identifier.shell', foreground: '000000' },
            { token: 'delimiter.shell', foreground: '000000' }
          ],
          colors: {}
        });
        
        monaco.editor.defineTheme('vs-dark-template-toolkit', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'delimiter.tt', foreground: 'C586C0', fontStyle: 'bold' },
            { token: 'delimiter.expression', foreground: 'FF9500', fontStyle: 'bold' },
            { token: 'keyword.tt', foreground: '569CD6', fontStyle: 'bold' },
            { token: 'string.tt', foreground: 'CE9178' },
            { token: 'string.json', foreground: 'CE9178' },
            { token: 'key.json', foreground: '9CDCFE', fontStyle: 'bold' },
            { token: 'keyword.json', foreground: '569CD6' },
            { token: 'number.json', foreground: 'B5CEA8' },
            { token: 'delimiter.json', foreground: 'D4D4D4' },
            { token: 'comment.tt', foreground: '6A9955', fontStyle: 'italic' },
            { token: 'variable.tt', foreground: '9CDCFE' },
            { token: 'function.tt', foreground: 'DCDCAA' },
            { token: 'number.tt', foreground: 'B5CEA8' },
            { token: 'operator.tt', foreground: 'D4D4D4' },
            
            { token: 'source.shell', foreground: 'D4D4D4' },
            { token: 'comment.shell', foreground: '6A9955', fontStyle: 'italic' },
            { token: 'keyword.shell', foreground: '569CD6', fontStyle: 'bold' },
            { token: 'string.shell', foreground: 'CE9178' },
            { token: 'variable.shell', foreground: '9CDCFE', fontStyle: 'bold' },
            { token: 'number.shell', foreground: 'B5CEA8' },
            { token: 'operator.shell', foreground: 'D4D4D4' },
            { token: 'identifier.shell', foreground: 'D4D4D4' },
            { token: 'delimiter.shell', foreground: 'D4D4D4' }
          ],
          colors: {}
        });
        
        return true;
      },
      
      getAvailableLanguages: function() {
        return Object.keys(customLanguages);
      },
      
      loadVSIXExtension: function(vsixUrl) {
        return Promise.reject('Функция в разработке');
      }
    };
  });
