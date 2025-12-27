
# Introduction

The report server service is designed for users to create their own reports using Claude Desktop. Users can utilize our prompt templates from the Docs folder to customize their Housekeeper Bee Inventory Management System reports. These prompts guide the AI assistant in generating a JSX file, which is then deployed to the template folder of the report server.


![](https://static.wixstatic.com/media/0d7edc_1b668cb0a678497a85902a899788bbd0~mv2.jpg)

<br>      

# Installation

1. Git clone the housekeeper bee report server to Linux Desktop *(Housekeeper Bee Server Running on Raspberry Pi 5)*
2. Goto `housekeeper-bee-report-server` folder
3. Goto `setup` folder
4. chmod +x *.sh
5. Run the `setup_report_server.sh` file

It will add a startup file to launch the report server when system boot up. And then you need update the .env file under the backend folder. 

# Setup

### Backend Server
1. Go to the **housekeeper-bee-report-server/src/backend/** folder.
```
cd ~/Desktop/housekeeper-bee-report-server/src/backend
```
2. Copy the .env.template to .env file. 
```
cp .env.templete .env
```
2. Edit the .env file. Replace 192.168.50.102 to your ip and replace the Housekeeper Bee API key to your API key.You can follow the YouTube to get the API key (https://youtu.be/x7zshcqJTlY?si=BaizGb1Abd8uhLla). 



<br>
Replace 192.168.50.102 to your IP.   

![](https://static.wixstatic.com/media/0d7edc_023d092210014cc08a49f43c188f494d~mv2.jpg)


### Frontend Server
- No configuration is required.


### Linux - Change file wall setting

allow 3801, 3800, 3801 and 5173    

```
sudo ufw allow 3800    
sudo ufw allow 3843    
sudo ufw allow 3801   
sudo ufw allow 5173    
```

<br>

# Requirements
- Housekeeper Bee Inventory Management System (Version 1.7.0 or higher).

<br>

Download 

Housekeeper bee Core Module: 
https://github.com/Thomas-Leung-852/HousekeeperBeeWebApp/archive/refs/heads/main.zip


App update module:
https://github.com/Thomas-Leung-852/HousekeeperBeeWebAppUpdateTool.git


iOS APP from Apple App Store: https://apps.apple.com/us/app/housekeeper-bee/id6742815735


<br>

# How to use the report service

For fresh installation of Housekeeper Bee App, the following code block already exists in the application.properties file.    
For manual update, add the following lines to the Housekeeper Bee application.properties file and then reboot.

Folder: :~/Desktop/housekeeping_bee/files/prog   
File:  application.properties    

Replace 192.168.50.102 to your ip   
```
#==================================================
# Apply to vesion 1.7.0
# Connect to external report server service
#==================================================
external.service.report-service.enabled=true
external.service.report-service.url=https://192.168.50.102
external.service.report-service.port=3843
external.service.report-service.secret=${service_print_server_secret}
```

![](https://static.wixstatic.com/media/0d7edc_360f1574e68a4f358163e87044dcfc23~mv2.jpg)

<br>

### Entry point of report server    

 - Login the Housekeeper Bee App. You can find the report service is enabled. Click the icon to swap to the report server main screen.    


![](https://static.wixstatic.com/media/0d7edc_cd01a2de6add4ed18fcb33f14c3b6102~mv2.jpg)


### Report server main page

-We have provided several reports for your reference. After placing your JSX file in the templates folder, press F5. You will then see your customized report added to the side menu.


![](https://static.wixstatic.com/media/0d7edc_a17e7e0d4a98489d92198e7c11d7ec48~mv2.jpg)


<br>



# Prompt

Prompts can be find from the ***Docs*** folder.

Sample
```

I want you create a very simple report to analysis my storage boxes usage in table format (column includes - #, location name, box name, barcode, number of item, storage items box status)


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

```

<br>

# Manual start the service

Go to ***housekeeper-report-server*** folder    

Command
```     
npm run prod
```
<br>

# Known Issues

After saving the code as a JSX file for deployment, you need to check for issues that may occasionally occur.

1. *const StorageTagAnalysis = ({ data<font color='#0F0'>, styles </font> }) => {*   
   Sometimes, Claude adds styles at line 2. You should manually remove the <font color="#f00">styles</font>.

2. <font color='#0F0'>*export default StorageBoxReport*</font> should be changed to     
   <font color='#f00'>module.exports = StorageBoxReport;</font>


<br>

# What is Housekeeper Bee 

![](https://static.wixstatic.com/media/0d7edc_2e9fb1886c0c4758bb3250b5a472725b~mv2.png)

We are excited to introduce our cutting-edge web-based application designed to simplify storage management for families and individuals. As urban living spaces become increasingly compact, our app addresses the rising demand for effective organization and efficient tracking of storage resources. It is fully compatible with desktop browsers.

The Housekeeper Bee Mobile App seamlessly integrates with our Household Items Management web application, which runs on your on-premise Raspberry Pi 5 (4GB) server.

Household Items Management Features:   
- Track Assets: Keep a detailed record of items stored in various locations, ensuring you always know where everything is.    
- AI Functionality: Leverage advanced features such as the MCP server and a Telegram-based AI agent.
- Our application enables you to monitor environmental temperature and humidity, effectively protecting your stored items in storage boxes. It proactively sends alert messages when preset thresholds are met. You can use natural language to instruct the AI assistant to make decisions regarding the control of dehumidifiers and fan.    
- Custom Reporting: Our newly developed report server empowers users to generate customized reports based on specific prompts. With the capabilities of the Claude Desktop AI assistant, creating your favorite report has never been easier.   
  

To download optional modules, please visit GitHub - Thomas Leung. https://github.com/Thomas-Leung-852


