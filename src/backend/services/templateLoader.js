import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { transformSync } from '@babel/core';
import { loadStyle } from '../utils/loadStyle.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../templates');

// Load and compile JSX template
export async function loadTemplate(templateName, cssStyle) {
  const templatePath = path.join(TEMPLATE_DIR, `${templateName}.jsx`);
  let jsxCode = await fs.readFile(templatePath, 'utf-8');

  console.log(`Loading template: ${templateName}`);

  const reportStyles = await loadStyle(cssStyle);

  // Inject styles object into template (place at the top after React require)
  const stylesInjection = `\nconst styles = ${JSON.stringify(reportStyles, null, 2)};\n`;

  // Find the React require line and inject styles after it
  if (jsxCode.includes("const React = require('react')")) {
    jsxCode = jsxCode.replace(
      /(const React = require\('react'\);)/,
      `$1${stylesInjection}`
    );
  } else if (jsxCode.includes('import React')) {
    // Handle ES6 import style
    jsxCode = jsxCode.replace(
      /(import React[^;]*;)/,
      `$1${stylesInjection}`
    );
  } else {
    // If no React import found, add both React and styles at the top
    jsxCode = `const React = require('react');${stylesInjection}\n${jsxCode}`;
  }

  // Transpile JSX to JavaScript using Babel
  const result = transformSync(jsxCode, {
    presets: [
      ['@babel/preset-react', {
        pragma: 'React.createElement',
        pragmaFrag: 'React.Fragment'
      }]
    ],
    filename: `${templateName}.jsx`
  });

  return result.code;
}

// Execute compiled template in a safe context
function executeTemplate(compiledCode, data) {
  const moduleExports = {};
  const module = { exports: moduleExports };

  // Create a function that executes the compiled code
  // Pass require, module, exports, React, and data
  const executeFunction = new Function(
    'require',
    'module',
    'exports',
    //'React',
    'data',
    `
    ${compiledCode}
    return module.exports;
    `
  );

  // Execute and get the component
  const Component = executeFunction(
    require,
    module,
    moduleExports,
    //React,
    data
  );

  // Handle both default and named exports
  return Component.default || Component;
}


// Render report to full HTML
export async function renderReport(templateName, cssStyle, data) {
  try {

    // Load and compile the template
    const compiledCode = await loadTemplate(templateName, cssStyle);

    // Execute the template to get the React component
    const Component = executeTemplate(compiledCode, data);

    // Check if Component is valid
    if (!Component) {
      throw new Error(`Template ${templateName} did not export a component`);
    }

    // Render the component to HTML string
    // Pass data as props if the component expects it
    var html = ReactDOMServer.renderToString(
      React.createElement(Component, { data })
    );

    // create barcode. set backend api url https://ip:3801
    if(html.length > 0){
      html = html.replaceAll('[!MY_API_SRV]', `${process.env.API_URL}`).replaceAll('[!my_api_srv]', `${process.env.API_URL}`);
    }

    // Wrap in a complete HTML document
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formatTitle(templateName)} - Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            margin: 0;
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
    </style>
   <script src='/js/housekeeperBee.js' ></script>
</head>
<body onload="init();" >
    ${html}
</body>
</html>
    `;
  } catch (error) {
    console.error(`Error rendering report ${templateName}:`, error);

    // Return error page
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - ${templateName}</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            padding: 40px;
            background: #fee;
        }
        .error-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            border-left: 5px solid #f44;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { color: #c00; margin-bottom: 20px; }
        pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>❌ Error Rendering Report</h1>
        <p><strong>Template:</strong> ${templateName}</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <pre>${error.stack}</pre>
    </div>
</body>
</html>
    `;
  }
}

// List all available templates
export async function listTemplates() {
  try {
    const files = await fs.readdir(TEMPLATE_DIR);
    return files
      .filter(file => file.endsWith('.jsx'))
      .map(file => file.replace('.jsx', ''));
  } catch (error) {
    console.error('Error reading templates directory:', error);
    return [];
  }
}

// Helper function to format template name to title
function formatTitle(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}