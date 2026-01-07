// Use RegEx
const checkForDangerousCodeEx = (fileContent) => {
    const dangerousPatterns = [
      // File system operations
      { pattern: /fs\.unlink|fs\.rmdir|fs\.unlinkSync|fs\.rmdirSync/gi, name: 'File deletion operations' },
      { pattern: /fs\.writeFile|fs\.writeFileSync|fs\.appendFile|fs\.appendFileSync/gi, name: 'File write operations' },
      { pattern: /fs\.mkdir|fs\.mkdirSync|fs\.rm|fs\.rmSync/gi, name: 'Directory operations' },
      { pattern: /fs\.rename|fs\.renameSync|fs\.copyFile|fs\.copyFileSync/gi, name: 'File manipulation' },
      { pattern: /fs\.chmod|fs\.chmodSync|fs\.chown|fs\.chownSync/gi, name: 'File permission changes' },

      // Child process executions
      { pattern: /child_process\.exec|child_process\.execSync/gi, name: 'Process execution' },
      { pattern: /child_process\.spawn|child_process\.spawnSync/gi, name: 'Process spawning' },
      { pattern: /child_process\.fork|child_process\.execFile/gi, name: 'Process forking' },

      // Dangerous imports
      { pattern: /require\s*\(\s*['"]child_process['"]\s*\)/gi, name: 'child_process import' },
      { pattern: /require\s*\(\s*['"]fs['"]\s*\)/gi, name: 'fs import' },
      { pattern: /import\s+.*\s+from\s+['"]child_process['"]/gi, name: 'child_process ES6 import' },
      { pattern: /import\s+.*\s+from\s+['"]fs['"]/gi, name: 'fs ES6 import' },
      { pattern: /import\s+.*\s+from\s+['"]node:fs['"]/gi, name: 'node:fs import' },
      { pattern: /import\s+.*\s+from\s+['"]node:child_process['"]/gi, name: 'node:child_process import' },

      // Process operations
      { pattern: /process\.exit|process\.kill|process\.abort/gi, name: 'Process termination' },
      { pattern: /process\.env\s*=/gi, name: 'Environment manipulation' },

      // Eval and dynamic code execution
      { pattern: /eval\s*\(/gi, name: 'eval() execution' },
      { pattern: /Function\s*\(|new\s+Function\s*\(/gi, name: 'Dynamic function creation' },
      { pattern: /setTimeout\s*\(\s*['"`]/gi, name: 'setTimeout with string' },
      { pattern: /setInterval\s*\(\s*['"`]/gi, name: 'setInterval with string' },

      // Network operations
      { pattern: /require\s*\(\s*['"]net['"]\s*\)/gi, name: 'net module import' },
      { pattern: /require\s*\(\s*['"]http['"]\s*\)/gi, name: 'http module import' },
      { pattern: /require\s*\(\s*['"]https['"]\s*\)/gi, name: 'https module import' },
      { pattern: /import\s+.*\s+from\s+['"]net['"]/gi, name: 'net ES6 import' },
      { pattern: /import\s+.*\s+from\s+['"]http['"]/gi, name: 'http ES6 import' },
      { pattern: /import\s+.*\s+from\s+['"]https['"]/gi, name: 'https ES6 import' },

      // Crypto mining patterns
      { pattern: /coinhive|crypto-loot|cryptonight/gi, name: 'Crypto mining code' },

      // Code obfuscation indicators
      { pattern: /atob\s*\(|btoa\s*\(/gi, name: 'Base64 encoding/decoding' },
      { pattern: /fromCharCode/gi, name: 'Character code conversion' },

      // Dangerous globals
      { pattern: /global\s*\[|global\s*\./gi, name: 'Global object access' },
      { pattern: /__dirname|__filename/gi, name: 'Directory/file path access' },

      // VM and sandbox escape
      { pattern: /require\s*\(\s*['"]vm['"]\s*\)/gi, name: 'VM module import' },
      { pattern: /vm\.runInNewContext|vm\.runInThisContext/gi, name: 'VM context execution' },

      // OS operations
      { pattern: /require\s*\(\s*['"]os['"]\s*\)/gi, name: 'OS module import' },
      { pattern: /os\.exec|os\.system/gi, name: 'OS command execution' },

      // Path traversal attempts
      { pattern: /\.\.\//g, name: 'Path traversal (Unix)' },
      { pattern: /\.\.\\+/g, name: 'Path traversal (Windows)' },

      // SQL injection patterns (if using database queries in JSX)
      { pattern: /DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO/gi, name: 'SQL commands' },

      // XSS patterns
      { pattern: /dangerouslySetInnerHTML/gi, name: 'dangerouslySetInnerHTML usage' },

      // Improved Import Detection
      {
        pattern: /(require|import)\s*\(?\s*['"](fs|child_process|path|os|net|http|https|vm|crypto|dns|zlib)['"]/gi,
        name: 'Core Node.js module access'
      },
      // Catching template literal imports
      {
        pattern: /import\s*\(?\s*`.*`\s*\)?/gi,
        name: 'Dynamic import with template literal'
      }

    ];

    const foundPatterns = [];

    for (let i = 0; i < dangerousPatterns.length; i++) {
      const { pattern, name } = dangerousPatterns[i];
      const matches = fileContent.match(pattern);
      if (matches) {
        foundPatterns.push({
          name: name,
          examples: matches.slice(0, 2) // Show up to 2 examples
        });
      }
    }

    return foundPatterns;
  };

  export default checkForDangerousCodeEx;