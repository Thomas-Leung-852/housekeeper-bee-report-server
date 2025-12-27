

I want you create a very simple report to analysis my storage boxes usage by storage items, location name, box name (column #, total number of items, storage items, location name, box name, barcode, box status [show number only - empty=0%, "25% Occupied"=25%, "50% Occupied"=50%, "75% Occupied"=75% and "fully occupied"=100%],tags). it should also check for just "fully" or "full" keywords.
Updated Logic:
Checks for "empty" or "0%" → 0%
Checks for "25% Occupied" → 25%
Checks for "50% Occupied" → 50%
Checks for "75% Occupied" → 75%
Checks for "fully", "full", or "100%" → 100%
Then tries to extract numeric percentage if no keywords match
This should now properly detect boxes marked as "fully occupied" and display them as 100% instead of 0%. The box in your screenshot should now show 100% with a green progress bar.

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
- Add data time on right hand side coner 
- storage item: usb type-A cable, charger, 5xUSB type-C cable 
- if report grouping use tag field, the tags split by ',' or '，' 
- storage item N x item or item x N that means 3 x item or item x 3. (e.g. 3 x Type-C cable or Type-C cable x 3 = The total number of Type-C cable is 3). No multiplier → counts as 1 item 
- storage item count: 1+1+5
- storage item count: 7
- finally storage item field replace ',' or '，' by carry return new line. And add * before processed storage item.

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
    <select id='filter-select' style='maxWidth: 900px;'>
        <option value=''>All</option> 
    </select>"

I. JSX requirement
-. change ES syntax to CommonJS (such as keywords - "import" change to "const", "export default" change to "moudle.exports" and etc.)

J.Create EAN-13 barcode image by using the following code:
```
            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.9rem', textAlign: 'center' }}>
                {row.barcode ? (
                  <img
                    alt='Barcode Generator TEC-IT'
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${row.barcode}&code=EAN13`}
                  />
                ) : (
                  <span>No Barcode</span> // Optional: display a message if there's no barcode
                )}
                <br></br>
                {row.barcode}
              </td>
```



