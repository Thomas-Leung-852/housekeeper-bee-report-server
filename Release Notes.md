# RELEASE NOTE

## Version: v1.2.2
Release Date: 2026/01/21

### ✦ Bug Fixed
- Export CSV/JSON/ PDF multiple times 
- Report dashboard cannot load the bookmarks.

## Version: v1.2.1
Release Date: 2026/01/16-B

### ✦ Critical Bug Fixed
- The nedb package is not compatible with Node version 24.13.0 LTS, so we have switched to using the @seald-io/nedb package instead.

If you have already updated to v1.2.0, you need to uninstall nedb and then install @seald-io/nedb.

Step 1: Goto ***housekeeper-report-server/src/backend/***    
Step 2: Run the following commands

```
# Remove old nedb
npm uninstall nedb

# Install @seald-io/nedb
npm install @seald-io/nedb
```
<br>    

## Version: v1.2.0
Release Date: 2026/01/16-A

### ✦ Bug Fixed
- Prompt-General.md in download folder - Removed preset report requirement

### ✦ AI Template Generator

- Store the last prompt in the active session. You can enhance the report by appending comments at the end of the original prompt to optimize it.

![](https://static.wixstatic.com/media/0d7edc_b271c80569e74c8e835399275775f5c7~mv2.jpg)

### ✦ Report main screen

- Bookmark Favorite Reports: Implement a feature that allows users to bookmark their favorite reports for easy access.

- Filter by Report Name and Bookmarked Reports: Include functionality to filter reports by name and to view only the bookmarked reports for quicker navigation.



<br>

Backend installed the following packages

```
npm install nedb jsonwebtoken
```
<br>

![](https://static.wixstatic.com/media/0d7edc_cbe7c0dbb2ec48148fd9465d0b70184c~mv2.jpg)
![](https://static.wixstatic.com/media/0d7edc_72482ef44511479eb2eda078853b5743~mv2.jpg)


### Requirement

Housekeeper Bee Web App v1.7.1   

![](https://static.wixstatic.com/media/0d7edc_13c46688237b46f8ace24bcf191e1608~mv2.jpg)

Download:    

- Core Application: https://github.com/Thomas-Leung-852/HousekeeperBeeWebApp


- Application Updater: https://github.com/Thomas-Leung-852/HousekeeperBeeWebAppUpdateTool


## Version: v1.1.0
Release Date: 2026/01/08

### ✦ Added 5 new report template

1. Box-Barcode-Stock-Take-List.jsx
2. card-view-barcode.jsx
3. Category-Distribution-(Tag-Cloud)-Report.jsx
4. Individual-Tag-Usage.jsx
5. Storage-Occupancy-&-Capacity.jsx

### ✦ Bugs fixed

- PDF missing barcode

### ✦ Added report template maintenance function

 - Features: file listing, file upload, file deletion, and file renaming.

![](https://static.wixstatic.com/media/0d7edc_3fdb31e3f93e4290a0e637a0adc69b71~mv2.jpg)

#### Setup 

```
# Install the following packages on the backend server

npm install multer human-names common-words bwip-js jsbarcode canvas

```

### ✦ Added AI report template Generator

Use Ollama Cloud to create report template JSX file. You need to apply an API key from Ollama.com and update the /backend/.env file.
![](https://static.wixstatic.com/media/0d7edc_810cba991dc34b5696c3e06d6384fea5~mv2.jpg)



![](https://static.wixstatic.com/media/0d7edc_97514733719d4598b4be64cda9ecce27~mv2.jpg)

### ✦ Threat Detection in Report Templates

Added node packages

```
npm install acorn acorn-walk acorn-jsx -y
```

**[1] Frontend Threat Detection: The system scans for dangerous patterns before upload:**   

Use regex (Regular Expressions) parser (fast)

- File system operations (`fs.*`)   
- Child process execution   
- Dangerous imports (`fs`, `child_process`, `net`, `http`, `https`, `vm`, `os`)   
- Dynamic code execution (`eval`, `Function`)   
- Process operations   
- Code obfuscation (`atob`, `btoa`, `fromCharCode`)   
- Path traversal (`../`)   
- Crypto-mining patterns   
- SQL injection and XSS (dangerouslySetInnerHTML)    
- VM/sandbox escape attempts   
- Dangerous globals  

User Experience:   
When a dangerous file is selected, the user sees:    

```
File contains potentially dangerous code and cannot be uploaded:

- File deletion operations: `fs.unlink`, `fs.rmdir`
- Process execution: `child_process.exec`
- fs import: require('fs')

```

**[2] Backend Threat Detection: As a second layer of defense (defense in depth), the backend also validates:**     

Use an AST (Abstract Syntax Tree) parser for more secure analysis.

- File System Operations
`fs.unlink`, `fs.rmdir`, `fs.writeFile`, `fs.mkdir`   
`fs.rename`, `fs.copyFile`, `fs.chmod`, `fs.chown`, `fs.rm`   

- Child Process Execution    
`child_process.exec`, `spawn`, `fork`, `execFile`    

- Dangerous Imports     
`require('fs')`, `require('child_process')`     
`import from 'fs'`, `import from 'child_process'`     
Node.js protocol imports (node:fs, node:child_process)    

- Process Operations    
`process.exit`, `process.kill`, `process.abort`   
Environment manipulation   

- Dynamic Code Execution     
`eval()`, `Function()`, `new Function()`    
`String-based setTimeout`, `setInterval`    

- Network Operations    
`require('net')`, `require('http')`, `require('https')`    

- Code Obfuscation    
`atob()`, `btoa()`, `fromCharCode`   

- VM & Sandbox Escape    
`require('vm')`, `vm.runInNewContext`  

- OS Operations
`require('os')`, OS system calls   

- Path Traversal    
`../` and `..\` patterns   

- Crypto Mining
Common crypto mining script names   

- Dangerous Globals    
`global[]`, `__dirname`, `__filename`   

#### [Remark]
The file is rejected immediately and never uploaded to the server! This saves bandwidth and protects your server. 🛡️    
You can also keep the backend validation as a second layer of defense (defense in depth).     

### Disclaimer
This is a proof of concept (PoC) for no-code or low-code solutions using natural language. We do not recommend using JSX report templates from untrusted sources, and we cannot guarantee that malicious code will be detected 100% of the time. You should proceed at your own risk when using this feature.

---




