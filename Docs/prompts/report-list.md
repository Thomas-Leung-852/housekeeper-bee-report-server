## Report List Sample prompts

1. 
**Storage Box Usage by Location**: Create a report to analyze storage box usage grouped by location, box name, and number of boxes. Include a table with the following columns: **# (sequence number), Location Name, Box Name, Barcode, Number of Items, Storage Item Box Status.**

2. 
**Bar Chart Visualization**: Create a report to visualize storage box usage in a bar chart, grouped by tag. **Use pure HTML/CSS/SVG for the chart.**

3. 
**Tag Percentage Bar Chart**: Create a report showing tag percentage stocked in a bar chart, grouped by location. **Use pure HTML/CSS/SVG for the chart.**

4. 
**Pie Chart of Storage Items**: Create a report analyzing storage box usage with a pie chart representing the count of items in boxes, using unique colors for each box.  
   - Data table columns: **# (sequence number), Location Name, Box Name, Storage Items Name, Total Number of Items, Percentage.**  
   - **Use pure HTML/CSS/SVG for the pie chart.**

5. 
**Person-Related Pie Chart of Storage Items**: Create a report analyzing storage box usage based on tags related to individuals (e.g., "Tom," "Ada"). The report should include a pie chart representing the count of items in boxes for each individual. Use unique colors for each person's associated boxes.  
   - Use the **`human-names`** Node.js package to identify if a tag is an individual (e.g., "Ada", "Hugo", "Cherry"). If the package fails to load, use a capital-case heuristic to determine individual names.  
   - Data table columns: **# (sequence number), Individual Tag Name (e.g., Ada), Location Name, Box Name, Storage Items Name, Total Number of Items, Percentage.**  
   - **Use pure HTML/CSS/SVG for the pie chart.**

6. 
**Report by Tag**: Create a report analyzing storage box usage by tag with columns: **# (sequence number), Tag Name, Total Number of Tags, Location Name, Box Name**, and include necessary insights into stored items.

7. 
**Detailed Storage Item Analysis**: Create a report analyzing storage box usage by storage items with these columns: **# (sequence number), Total Number of Items, Storage Items, Location Name, Box Name, Barcode, Box Status** (show only numbers: empty=0%, 25%, 50%, 75%, fully occupied=100%).  
   - Updated Logic:
     - Checks for "empty" or "0%" → 0%
     - Checks for "fully," "full," or "100%" → 100%
     - Extracts numeric percentage if no keywords match.

8. 
**Summary of Tags**: Create a report analyzing storage box usage in table format, including columns: **# (sequence number), Location Name, Box Name, Box Barcode, Storage Items (fixed column width 300px, word-wrap), Number of Items, Tag Name.** In the summary section, display “Total Unique Tags:” without counting total tags.

9. 
**Grouped by Tag and Number of Boxes**: Create a report analyzing storage box usage grouped by tag and number of boxes, displayed in a table (columns: **# (sequence number), Tag, Number of Boxes, Boxes Name** [each box on a new line]), followed by a bar chart below the data table. **Use pure HTML/CSS/SVG for the bar chart.**

10. 
Storage Occupancy & Capacity Report
Real-time overview of storage box utilization and inventory across all locations
I need a storage management report that shows me at a glance how full my storage boxes are across different locations. The dashboard should display summary statistics like total boxes, how many are full, and overall capacity usage. I want to see each box listed with its location, how full it is shown with a circular gauge or donut chart that visually represents the percentage, what's inside, and any tags I've assigned. I should be able to filter by location to focus on specific areas. Use clear color coding so I can quickly spot boxes that need attention - red for full, orange for nearly full, and green for available space.
**Use pure HTML/CSS/SVG for the chart.**

11. 
**Box Barcode Stock Take List**
Our recent inventory review highlighted the need for a comprehensive box barcode stock take list. This report will significantly enhance our tracking capabilities by dividing the information into three clear sections. First, we want a card view showcasing all boxes with barcodes, including key details like the barcode, box name, and location. Next, we need a detailed table summarizing each box's location, name, items, number of items, and status. Finally, a summary section should provide insights into our inventory, such as the total number of boxes and their current status. This structured approach will simplify our inventory management and improve decision-making.

12. 
Stock Taking report
Please generate a stock taking report exclusively in a card view format. Each card should include a barcode image, the location name, the box name, and the box status. Organize the layout so that each row contains four cards, ensuring they are well-spaced for clarity. Utilize the provided predefined styles for both light and dark modes—custom styles are not allowed to maintain consistency. Additionally, please ensure the design is responsive and adheres to accessibility guidelines for optimal user experience.

13.
USB Cable Inventory Report
Please provide a report on the inventory levels of USB cables, grouped by storage item descriptions. The report should include the following details for each type, such as USB-A, USB-C, Micro USB, and others, to assess current stock levels. The report must include the following columns: sequence number, item description, quantity available, location name, box name, and barcode image.

Tips: Ensure to use storage item descriptions that contain the keywords 'USB' or 'cables' for the respective boxes to streamline the categorization process. This request is for tabular data only.


