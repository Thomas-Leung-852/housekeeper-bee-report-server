
## Report List   
1. I want you create a very simple report to analysis my storage boxes usage group by location, box name and number of boxes.
2. I want you create a very simple report to analysis my storage boxes usage show in a bar chart
3. I want you create a very simple report to analysis my storage boxes usage show in a bar chart group by tag
4. I want you create a very simple report to analysis my storage boxes usage of tag percentage stocked bar chart group by location
5. I want you create a very simple report to analysis my storage boxes usage- count number of items in boxes. And show value on a pie chart in percentage. Use unique color for each box. uses pure HTML/CSS/SVG for the pie chart. 
Data table columns - #, Location name, box name, storage items name, total number of item, percentage. 

6. I want you create a very simple report to analysis my storage boxes usage in table format (column includes - #, location name, box name, barcode, number of item, storage items box status)
7. I want you create a very simple report to analysis my storage boxes usage by tag, location name, box name (column #, tag name, total number of tag, location name, box name)
8. I want you create a very simple report to analysis my storage boxes usage by owner (column #, owner name, box name, location name, store items [fix column width 300px, word-wrap], total number of items)
9. I want you create a very simple report to analysis my storage boxes usage by tag (column #, tag, box name, location name, store items [fix column width 300px, word-wrap], total number of items) 
10. I want you create a very simple report to analysis my storage boxes usage in table format (column includes - #, location name, box name, box barcode, storage items [fix column width 300px, word-wrap], number of item, tag name).In 
summary section, no need count total number of tags. I need "Total Unique Tags:".

11.  I want you create a very simple report to analysis my storage boxes usage by tag, location name, box name (column #, tag name, location name, box name, stored items)
12.  I want you create a very simple report to analysis my storage boxes usage by storage items, location name, box name (column #, total number of items, storage items, location name, box name, barcode, box status [show number only - empty=0%, 25%, 50%, 75% and fully occupied=100%],tags). it should also check for just "fully" or "full" keywords.
Updated Logic:
Checks for "empty" or "0%" → 0%
Checks for "fully", "full", or "100%" → 100%
Then tries to extract numeric percentage if no keywords match
This should now properly detect boxes marked as "fully occupied" and display them as 100% instead of 0%. The box in your screenshot should now show 100% with a green progress bar.

13. I want you create a very simple report to analysis my storage boxes usage gropu by tag and number of boxes show data in table (column #, tag, number of boxes, boxes name [each box add newline]) and then show bar chart below the data table. uses pure HTML/CSS/SVG for the bar chart.

## Claude Desktop prompt

Copy the one of the above prompt to below template and then run on Cloud Desktop to generate a report. Feel free to modify the report's appearance. Sections A to J provide general instructions for transforming the raw data into the required dataset to render the report. You can control the displayed fields and the aggregation of data.


## Prompt for report creation


I want you create a very simple report to analysis my storage boxes usage gropu by tag and number of boxes show data in table (column #, tag, number of boxes, boxes name [each box add newline]) and then show bar chart below the data table. uses pure HTML/CSS/SVG for the bar chart.

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
- Add the date and time to the top right corner.
- Storage items include: USB Type-A cable, charger, 5 x USB Type-C cables.
- When grouping reports, use the tag field. Tags should be separated by commas (`,` or `，`).
- For storage items, the notation "N x item" or "item x N" indicates quantity (e.g., "3 x Type-C cable" or "Type-C cable x 3" means the total number of Type-C cables is 3). If no multiplier is specified, it counts as 1 item.
- Example of storage item count: 1 + 1 + 5.
- Total storage item count: 7.
- Finally, replace commas (`,` or `，`) in the storage item field with a line break. Add an asterisk (`*`) before each processed storage item.

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
- Please embed the code within a JSX component to handle the data structure transformation.
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

I. when compare the box or location status, use the following check sequence:
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
      }else if (status.includes('fully') || status.includes('full') || status.includes('100%')) {
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

J. JSX requirement
-. change ES syntax to CommonJS (such as keywords - "import" change to "const", "export default" change to "moudle.exports" and etc.)




