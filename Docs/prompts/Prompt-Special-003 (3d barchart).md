

```
I want you create a very simple report to analysis my storage boxes usage with 3D bar chart group by location 
And a table with column - #, location name, box name, store items [fix column width 300px, word-wrap], total number of items
uses pure HTML/CSS/SVG for the chart.

A. Create a Housekeeper Bee report as a JSX component in CommonJS format.

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
1.storage item count calculation rule:
- Add data time on right hand side coner 
- storage item: usb type-A cable, charger, 5xUSB type-C cable 
- if report grouping use tag field, the tags split by ',' or '，' 
- storage item N x item or item x N that means 3 x item or item x 3. (e.g. 3 x Type-C cable or Type-C cable x 3 = The total number of Type-C cable is 3). No multiplier → counts as 1 item 
- storage item count: 1+1+5
- storage item count: 7
- finally storage item field replace ',' or '，' by carry return new line. And add * before processed storage item.
2. DO NOT change storage item display string
3.  Pure CSS 3D - Uses CSS transform: rotateX() rotateY() and perspective for 3D effect
✅ No useEffect - Chart renders directly in the component
✅ Simple and Free - No external libraries needed for the chart
✅ Color-coded bars - Red (few boxes) to Green (many boxes)
✅ Interactive - Shows box count on each bar
✅ Grouped by User & Location - Each bar represents a user-location combination
4. 3D Effect:
-Reduced rotation angles (8deg/3deg vs 10deg/5deg) for clearer view
-Taller bars (max 280px vs 250px)
-Better lighting with brightness adjustments on faces
-Enhanced shadows and borders
5.Horizontal Scrolling:
- Outer container has overflowX: auto for horizontal scroll
- Inner container has fixed minWidth to force scrollbar when needed
- Bars are wider (80px vs 60px) with more spacing (30px vs 20px)

D. STYLING RULES:
- Use the "styles" object (will be injected by server)
- Available styles: container, header, subtitle, statCard, cardTotal, cardSuccess, cardWarning, cardDanger, cardInfo, statNumber, statLabel, table, tableHeader, th, td, progressBar, bar, bar100, bar75, bar50, bar25, bar0
- Do NOT define the styles object yourself
- Use inline styles: style={styles.container}
- Combine styles: style={{...styles.statCard, ...styles.cardSuccess}}

E. COMPONENT FORMAT:
- Accept props: { data }
- Export as: module.exports = ComponentName
- Use React.createElement or JSX

Embed the code generated in the JSX component to transform the raw JSON data from the RESTful API into the desired report data structure in JSON format.

For example, you call the MCP server tools to retrieve the raw data from Housekeeper Bee. Then, you use this data to transform it into the required report data structure.

F. IMPORTANT: 
- Please embed the code in the JSX component for the data structure transformation.
- Do not use useEffect

G. Table column sorting requirement:
- Add table id as "sortableTable"
- Add table columns sorting

H. Table column filter requirement: 
- Render the double quoted HTML code
 "<label for='filter-select'>Filter by:</label>
    <select id='filter-select'>
        <option value=''>All</option> 
    </select>"

I. JSX requirement
-. change ES syntax to CommonJS (such as keywords - "import" change to "const", "export default" change to "moudle.exports" and etc.)

J. Security requirement
- NO Node.js file system modules
- NO child process execution
- NO dynamic code execution
- NO browser storage APIs
- NO external network calls (except relative API paths)
- NO dangerous HTML manipulation

K. Forbidden Patterns - NEVER USE:
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
