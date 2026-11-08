// Using AST - Abstract Syntax tree 
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import acornJsx from 'acorn-jsx';

const JSXParser = acorn.Parser.extend(acornJsx());

// Custom visitor for JSX nodes
const jsxBaseVisitor = walk.make({
  ...walk.base,
  JSXElement: () => { },
  JSXOpeningElement: (node, state, callback) => {
    node.attributes.forEach(attr => callback(attr, state));
  },
  JSXClosingElement: () => { },
  JSXText: () => { },
  JSXExpressionContainer: (node, state, callback) => {
    callback(node.expression, state);
  },
  JSXAttribute: (node, state, callback) => {
    callback(node.name, state);
    if (node.value) callback(node.value, state);
  },
  JSXIdentifier: () => { },
  JSXFragment: () => { },
  JSXOpeningFragment: () => { },
  JSXClosingFragment: () => { },
  JSXSpreadAttribute: () => { },
  JSXMemberExpression: () => { },
  JSXNamespacedName: () => { },
});

const checkForDangerousCode = (fileContent) => {
  const foundPatterns = [];
  let ast;
  let isES6 = false;

  try {
    ast = JSXParser.parse(fileContent, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
    });
  } catch (err) {
    console.error("Parser Error:", err.message);
    return [];
  }

  const addFinding = (name, example, severity) => {
    const existing = foundPatterns.find(p => p.name === name);
    if (existing) {
      if (existing.examples.length < 3) existing.examples.push(example);
    } else {
      foundPatterns.push({ name, severity, examples: [example] });
    }
  };

  walk.simple(ast, {
    // --- 1. Dangerous Imports (ESM & CJS) ---
    ImportDeclaration(node) {
      isES6 = true;
      const source = node.source.value;
      if (/^(node:)?(fs|child_process|os|net|http|https|vm|crypto|dns|zlib)$/.test(source)) {
        addFinding('Dangerous Import', `import from '${source}'`, 'High');
      }
    },
    ExportNamedDeclaration() { isES6 = true; },
    ExportDefaultDeclaration() { isES6 = true; },
    ExportAllDeclaration() { isES6 = true; },

    CallExpression(node) {
      const { callee, arguments: args } = node;

      // require() and Node.js protocol
      if (callee.type === 'Identifier' && callee.name === 'require') {
        const arg = args[0];
        if (arg && arg.type === 'Literal' && typeof arg.value === 'string') {
          if (/^(node:)?(fs|child_process|os|net|http|https|vm|crypto|dns|zlib)$/.test(arg.value)) {
            addFinding('Sensitive Module Require', `require('${arg.value}')`, 'High');
          }
        }
      }

      // fetch() to external URLs (only fetch('/api/...') is allowed)
      if (callee.type === 'Identifier' && callee.name === 'fetch') {
        const arg = args[0];
        if (arg && arg.type === 'Literal' && typeof arg.value === 'string') {
          if (/^https?:\/\//i.test(arg.value)) {
            addFinding('External Network Request', `fetch('${arg.value.substring(0, 60)}')`, 'High');
          }
        }
      }

      // Dynamic Code Execution & Obfuscation
      if (callee.type === 'Identifier') {
        if (callee.name === 'eval') addFinding('Remote Code Execution', 'eval()', 'High');
        if (['atob', 'btoa'].includes(callee.name)) addFinding('Code Obfuscation', `${callee.name}()`, 'Low');
        if (['setTimeout', 'setInterval'].includes(callee.name) && args[0]?.type === 'Literal') {
          addFinding('Dynamic Execution', `${callee.name} with string literal`, 'Medium');
        }
      }

      // Member Expressions (fs, child_process, process, vm)
      if (callee.type === 'MemberExpression') {
        const objName = callee.object.name;
        const propName = callee.property.name || callee.property.value;

        // File System
        if (objName === 'fs') {
          const isDestructive = /unlink|rm|write|append|chmod|chown|rename|mkdir|copy/i.test(propName);
          addFinding('File System Operation', `fs.${propName}()`, isDestructive ? 'High' : 'Low');
        }
        // Child Process
        if (objName === 'child_process' || ['exec', 'spawn', 'fork', 'execFile'].includes(propName)) {
            if (objName === 'child_process' || objName === 'cp') {
                addFinding('Shell Command Execution', `child_process.${propName}()`, 'High');
            }
        }
        // Process Operations
        if (objName === 'process') {
          if (['exit', 'kill', 'abort'].includes(propName)) addFinding('Process Termination', `process.${propName}()`, 'High');
          if (propName === 'env') addFinding('Environment Manipulation', 'process.env access', 'Medium');
        }
        // VM/Sandbox
        if (objName === 'vm' && propName.includes('runIn')) addFinding('VM Sandbox Escape', `vm.${propName}()`, 'High');
        // Obfuscation
        if (propName === 'fromCharCode') addFinding('Code Obfuscation', 'String.fromCharCode', 'Medium');
        // Window object access
        if (objName === 'window') {
          addFinding('Window Object Access', `window.${propName}`, 'Medium');
        }
        // Document dangerous properties only — safe DOM reads (getElementById,
        // querySelector, querySelectorAll, etc.) are allowed for client-side
        // interactivity in SSR-rendered templates and are NOT flagged.
        if (objName === 'document') {
          if (/^(cookie|write|writeln|location|domain|referrer)$/.test(propName)) {
            addFinding('DOM Manipulation / Data Leak', `document.${propName}`, 'High');
          }
        }
        // Browser fingerprinting
        if (objName === 'navigator') {
          addFinding('Browser Fingerprinting', `navigator.${propName}`, 'Low');
        }
        // Cross-origin communication
        if (propName === 'postMessage') {
          addFinding('Cross-Origin Communication', 'postMessage() usage', 'Medium');
        }
        // Prototype pollution
        if (propName === '__proto__') {
          addFinding('Prototype Pollution', '__proto__ access', 'High');
        }
      }
    },

    // --- 2. Dynamic Execution via 'new Function' / Network via WebSocket ---
    NewExpression(node) {
      if (node.callee.name === 'Function') addFinding('Remote Code Execution', 'new Function()', 'High');
      if (node.callee.name === 'WebSocket') addFinding('WebSocket Connection', 'new WebSocket()', 'Medium');
    },

    // --- 3. Path Traversal, SQLi, and Mining Patterns ---
    Literal(node) {
      if (typeof node.value === 'string') {
        const val = node.value;
        if (/\.\.\/|\.\.\\/.test(val)) addFinding('Path Traversal Risk', 'Relative path segments (../)', 'Medium');
        if (/minergate|coin-hive|stratum\+tcp|cryptonight/i.test(val)) addFinding('Crypto Mining', 'Mining pool/keyword detected', 'High');
        if (/DROP\s+TABLE|DELETE\s+FROM/i.test(val)) addFinding('SQL Injection Risk', 'Destructive SQL keyword', 'High');
        if (val.includes('dangerouslySetInnerHTML')) addFinding('XSS Risk', 'dangerouslySetInnerHTML in string', 'High');
      }
    },

    // --- 4. Dangerous Globals ---
    Identifier(node) {
      if (['__dirname', '__filename', 'global'].includes(node.name)) {
        addFinding('Dangerous Global/Path Disclosure', node.name, 'Low');
      }
      if (node.name === 'XMLHttpRequest') {
        addFinding('Network Request', 'XMLHttpRequest usage', 'High');
      }
      if (['localStorage', 'sessionStorage', 'indexedDB'].includes(node.name)) {
        addFinding('Browser Storage Access', `${node.name} usage`, 'Medium');
      }
    },

    // --- 5. React/XSS specific ---
    JSXAttribute(node) {
      if (node.name.name === 'dangerouslySetInnerHTML') addFinding('XSS Risk', 'JSX dangerouslySetInnerHTML', 'High');
    },
    Property(node) {
      const keyName = node.key.name || node.key.value;
      if (keyName === 'dangerouslySetInnerHTML') addFinding('XSS Risk', 'Object property dangerouslySetInnerHTML', 'High');
      if (keyName === '__proto__') addFinding('Prototype Pollution', '__proto__ property assignment', 'High');
    }
  }, jsxBaseVisitor);

  if (isES6) {
    addFinding('Forbidden Syntax', 'ES6 Import/Export detected (CommonJS required)', 'High');
  }

  return foundPatterns;
};

export default checkForDangerousCode;