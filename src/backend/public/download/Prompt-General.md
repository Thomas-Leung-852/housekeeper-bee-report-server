## Prompt Template for report creation

A. Create a Housekeeper Bee report as a JSX component in CommonJS format.
- Format: JSX component using CommonJS (const React = require('react'), module.exports = ...).
- Signature: const HousekeeperBeeReport = ({ data }) => { ... }
- Hooks: Do NOT use useEffect or useState. Perform all logic in the function body.
- **CRITICAL**: Do NOT access `document` object during render. Use inline event handlers (onClick, onChange) instead of getElementById.
- **CRITICAL**: Do NOT call functions that access DOM elements during component render. Only access DOM in event handlers.
- Include the AI assistant name in code comment. 
- Include the AI model name and version in code comment.    
- Include report sub-title follow the "Housekeeper Bee Report", if the sub-title not provided, you should create a sub-title for the report.

B. RAW Data structure (Input data) sample:   
{   
   storageCode: 'ec93960c4a93ea7c5a58163cd6db6fe2',   
   storageName: 'Blue box (cables)',   
   storageDesc: 'Micro HDMI x 1, C to 3.5mm USB cable x 1, 3.5mm AUX cable x 1, A to charger USB cable x 1',   
   storageRemark: '',   
   storageStatus: 'Check-In, 75% occupied',   
   barcode: '0250208000047',   
   storageCreatedDate: '2025-01-27T16:37:52.810+00:00',   
   storageModifiedDate: '2025-08-05T07:02:43.283+00:00',   
   locationCode: '2f9c0b9731cff1dd83e4b50386732ba2',   
   locationName: 'bedroom',   
   locationStatus: 'Full',   
   familyName: 'My Dream House',   
  tags: [ 'cables', 'hdmi', 'electronics', 'audio' ]   
}   

C. RULES:
- Include date and time at the top right corner.
- Include "Report Template Created by:" at the top right corner follow the date and time.
- Include the AI model name and version at the top right corner follow the "Report Template Created by:".
- Include the AI assistant name at the top right corner follow the AI model name.
- Include the duration of creating the report template at the top right corner follow the AI assistant name.
- Storage items include: USB Type-A cable, charger, 5 x USB Type-C cables.
- When grouping reports, use the tag field. Tags should be separated by commas (`,` or `，`).
- For storage items, the notation "N x item" or "item x N" indicates quantity (e.g., "3 x Type-C cable" or "Type-C cable x 3" means the total number of Type-C cables is 3). If no multiplier is specified, it counts as 1 item.
- Replace commas(`,` or `，`)  in storage items with line breaks and add an asterisk before each item.

D. STYLING RULES:
- Use the global "styles" object; do not define it in the component.
- Available predefined styles: container, header, subtitle, statCard, cardTotal, cardSuccess, cardWarning, cardDanger, cardInfo, statNumber, statLabel, table, tableHeader, th, td, progressBar, bar, bar100, bar75, bar50, bar25, bar0
- Access styles directly: style={styles.container}
- Combine styles: style={{...styles.statCard, ...styles.cardSuccess}}
- Do NOT define the styles object yourself - it will be injected at runtime
- Do NOT include styles as a component prop

E. COMPONENT FORMAT:
- Accept ONLY one prop: { data }
- Export as: module.exports = ComponentName
- Use React.createElement or JSX syntax for rendering.

F. Data Transformation & Name Identification:
- Embed code within the component to transform raw JSON data into the required report structure.

G. Name Identification (Technical Handling)
- This section applies only if the report requires grouping boxes by individual tags. If not specified, ignore this section.   
- Individual Check: Import human-names and filter the tags to check for matches in the name dictionary, ensuring case-insensitive comparison. If the package fails to load, use a capital-case heuristic.     
- Package Access: Create a name lookup set from humanNames.male and humanNames.female.     
Set Implementation:    
javascript    
```
   // 1. IMPROVED NAME LOADING
  // human-names usually exports names grouped by language or by gender.
  // We'll flatten everything into one giant Set for maximum reliability.
  const getNames = () => {
    try {
      // Try to get the English list or the full list
      const list = humanNames.allEn || humanNames.all || [];
      // If the above fails, manually combine common properties
      const fallback = [
        ...(humanNames.male || []),
        ...(humanNames.female || []),
        ...(humanNames.en ? humanNames.en.male : []),
        ...(humanNames.en ? humanNames.en.female : [])
      ];
      return new Set([...list, ...fallback].map(n => n.toLowerCase()));
    } catch (e) {
      return new Set();
    }
  };  
```

H. Table Sorting:
- Use id="sortableTable" and implement table column sorting without document.getElementById.

I. Table Filtering: 
- Render the following HTML code:
```
    <label for='filter-select'>Filter by:</label>
    <select id='filter-select' style='maxWidth: 900px;'>
        <option value=''>All</option> 
    </select>
```

J. when compare the box or location status, use the following check sequence:
```   
      // Parse box status to percentage
      let statusPercent = 0;
      const status = (item.storageStatus || '').toLowerCase();
      
      if (status.includes('25% occupied')) {
        statusPercent = 25;
      } else if (status.includes('50% occupied')) {
        statusPercent = 50;
      } else if (status.includes('75% occupied')) {
        statusPercent = 75;
      } else if (status.includes('fully') || status.includes('full') || status.includes('100%')) {
        statusPercent = 100;
      } else if (status.includes('empty') || status.includes('0%')) {
        statusPercent = 0;
      }  else {
        // Try to extract numeric percentage
        const percentMatch = status.match(/(\d+)%/);
        if (percentMatch) {
          statusPercent = parseInt(percentMatch[1]);
        }
      }
```

K. JSX requirement
- Change ES6 module syntax to CommonJS (replace "import" with "require", remove "export default" and use "module.exports")
- Use pure HTML/CSS/SVG for all charts and visual gauges (no external charting libraries)
- Implement circular/donut gauges using SVG elements
- Ensure all visualizations render without dependencies

L. DOM Access Rules (CRITICAL):
- Do NOT access DOM methods during render. Use event handlers for any DOM interactions.

M.EAN-13 Barcode:
- The barcode width is 250 pixels
- Use the following code to generate the barcode image:
```
            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.9rem', textAlign: 'center' }}>
                {row.barcode ? (
                  <img
                    src={`[!MY_API_SRV]/api/barcode/ean13?data=${row.barcode}`}
                  />
                ) : (
                  <span>No Barcode</span> // Optional: display a message if there's no barcode
                )}
                <br></br>
                {row.barcode}
              </td>
```

N. Security requirement
- NO Node.js file system modules
- NO child process execution
- NO dynamic code execution
- NO browser storage APIs
- NO external network calls (except relative API paths)
- NO dangerous HTML manipulation

O. Forbidden Patterns - NEVER USE:
- ❌ `require('fs')` or `require('fs/promises')`
- ❌ `require('child_process')`
- ❌ `require('os')`, `require('net')`, `require('http')`, `require('https')`
- ❌ `require('vm')`, `require('path')`
- ❌ `eval()`, `new Function()`
- ❌ `localStorage`, `sessionStorage`, `indexedDB`
- ❌ `dangerouslySetInnerHTML`
- ❌ `process.exit()`, `process.env`, `process.kill()`
- ❌ File operations (fs.unlink, fs.writeFile, etc.)
- ❌ ES6 import/export syntax
