// inject the table column sorting to table id = sortableTable
tbColHdr = () => {
    const tables = document.querySelectorAll('table[id^="sort"]');

    tables.forEach(table => {
        const headers = table.querySelectorAll('th');

        headers.forEach((header, index) => {
            header.style.cursor = 'pointer'; // visual hint it's clickable
            header.addEventListener('click', () => {
                const rows = Array.from(table.rows).slice(1);
                const isAscending = header.classList.toggle('asc');

                rows.sort((a, b) => {
                    const aText = a.cells[index].textContent.trim();
                    const bText = b.cells[index].textContent.trim();

                    const aValue = isNaN(aText) ? aText : parseFloat(aText);
                    const bValue = isNaN(bText) ? bText : parseFloat(bText);

                    if (aValue < bValue) return isAscending ? -1 : 1;
                    if (aValue > bValue) return isAscending ? 1 : -1;
                    return 0;
                });

                rows.forEach(row => table.appendChild(row));
            });
        });
    });
}

// inject the table column filter to table id = sortableTable
tbColFilter = (objId, idx) => {
    const filterSelect = document.getElementById(`${objId}`);  //'filter-select'
    const filterCol = idx + 1
    //const colLabelName = document.querySelectorAll('th')[idx].innerText;

    var colLabelName = '';

    const containerId = filterSelect.parentElement?.id
    if (containerId) {

        console.log(containerId);

        const locTbId = `sortableTable_${containerId.split('_')[1]}`;
        var locTbHeaders = (document.getElementById(locTbId)).querySelectorAll('th');

        if(!locTbHeaders){
            locTbHeaders = (document.getElementById(locTbId)).querySelectorAll('thead');
        }

        colLabelName = locTbHeaders[filterCol].innerText;
    } else {
        colLabelName = document.querySelectorAll('th')[filterCol].innerText;
    }

    if (filterSelect == null) {
        return;
    }

    filterSelect.innerText = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = `All ${colLabelName}`;
    filterSelect.appendChild(option);

    //const dataTable = document.getElementById('sortableTable');
    // Backward compatible: data-table → first sort table → sortableTable
    const tableId = filterSelect.getAttribute('data-table'); 
    const dataTable = tableId
        ? document.getElementById(tableId)
        : document.querySelectorAll('table[id^="sort"]')[0];
    if (dataTable == null) return;

    function populateFilterOptions(columnIndex) {
        const uniqueValues = new Set();
        const rows = dataTable.getElementsByTagName('tr');

        // Loop through the rows to get unique values from the specified column
        for (let i = 1; i < rows.length; i++) { // Start at 1 to skip the header
            const cells = rows[i].getElementsByTagName('td');
            if (cells[columnIndex]) {
                uniqueValues.add(cells[columnIndex].textContent.trim());
            }
        }

        // Convert Set to Array
        const sortedUniqueValues = Array.from(uniqueValues).sort((a, b) => {
            // Check if both values are numbers
            const aNum = parseFloat(a);
            const bNum = parseFloat(b);

            // If both are numbers, sort numerically
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return aNum - bNum; // Sort numbers in ascending order
            }

            // If only a is numeric
            if (!isNaN(aNum)) {
                return -1; // Numeric comes before string
            }

            // If only b is numeric
            if (!isNaN(bNum)) {
                return 1; // Numeric comes before string
            }

            // For strings, sort alphabetically
            return a.localeCompare(b, undefined, { sensitivity: 'base' });
        });

        // Populate the combo box with sorted unique values
        sortedUniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            filterSelect.appendChild(option);
        });
    }

    function filterTable() {
        const filterValue = filterSelect.value;
        const rows = dataTable.getElementsByTagName('tr');

        // Loop through all rows, hiding those that don't match the filter
        for (let i = 1; i < rows.length; i++) { // Start at 1 to skip the header row
            const categoryCell = rows[i].getElementsByTagName('td')[filterCol]; // Change index for different columns
            if (categoryCell) {
                if (filterValue === '' || categoryCell.textContent === filterValue) {
                    rows[i].style.display = ''; // Show row
                } else {
                    rows[i].style.display = 'none'; // Hide row
                }
            }
        }

        //update row count
        const tbs = document.querySelectorAll('table[id^="sort"]');

        tbs.forEach( (tb) => {
            const allRows = tb.querySelectorAll('tbody tr');
            const visibleRows = Array.from(allRows).filter(tr => tr.offsetParent !== null);
            const tbLabel = document.getElementById(`tableRrdCnt_${tb.id}`);

            if(tbLabel){
                tbLabel.textContent  = `Total row: ${visibleRows.length}`;
            }
        });

    }

    if (filterSelect) {
        // Initial population of filter options for the specified column index
        populateFilterOptions(filterCol); // Change 1 to the desired column index for filtering (0-based)

        // Event listener for filtering the table when the dropdown changes
        filterSelect.addEventListener('change', filterTable);
    }

}

// inject code to export table data to JSON string
tbExport2Json = () => {
    const table = document.getElementById('sortableTable');

    if (table == null) {
        console.log('No table found!');
        return null;
    }

    const rows = table.getElementsByTagName('tr');
    const jsonArray = [];

    // Loop through rows, starting at 1 to skip the header
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const rowObject = {};

        // Loop through cells to create an object for each row
        for (let j = 0; j < cells.length; j++) {
            const header = table.getElementsByTagName('th')[j].textContent; // Get the header name
            rowObject[header] = cells[j].textContent.trim(); // Assign cell value to the header key
        }

        jsonArray.push(rowObject);
    }

    // Convert the array of objects to a JSON string
    const jsonString = JSON.stringify(jsonArray, null, 2); // Pretty-print with 2 spaces
    return jsonString; // Display the JSON string
}

//SVG chart injection
// in your prompt, the svg id should be set "barchart01"
injectChartAddFilter = () => {
    const filterSelect = document.getElementById('filter-select');

    if (document.querySelector('svg#barchart01') && filterSelect !== null) {

        filterSelect.addEventListener('change', filterChart);

        function filterChart(){
            document.getElementById('svgFilterBox').value = filterSelect.value;
            filterSVG();
        }


        // Create filter box 
        const filterContainer = document.createElement('div');
        filterContainer.innerHTML = ` <div style="padding: 0px; width:0px; max-width: 0px; margin: 0 auto;"> 
    <input type="text" id="svgFilterBox" placeholder="Type to filter (e.g., Hugo bedroom, 衣櫃頂, 書櫃)..." style="width: 100%; padding: 12px; font-size: 16px; border: 0px solid #ddd; border-radius: 4px; margin-bottom: 10px; box-sizing: border-box;"></div>
     <div id="svgResultCount" style="margin-bottom: 10px; color: #666; font-size: 14px;"></div>  `;

        // Insert filter box before the SVG 
        const svg = document.querySelector('svg');
        if (!svg) { alert('No SVG found on the page!'); return; }
        svg.parentNode.insertBefore(filterContainer, svg); 
        const filterBox = document.getElementById('svgFilterBox');

        const resultCount = document.getElementById('svgResultCount');
        const groups = svg.querySelectorAll('g');

        function updateResultCount(visible, total) {
            if (filterBox.value.trim() === '') {
                resultCount.textContent = `Showing all ${total} items`;
            } else { resultCount.textContent = `Showing ${visible} of ${total} items`; }
        }

        function filterSVG() {
            const searchText = filterBox.value.toLowerCase().trim();
            let visibleCount = 0;
            let currentY = 32;

            // Starting Y position 
            const rowHeight = 40;
            // Space between rows 
            groups.forEach(group => {
                const textElements = group.querySelectorAll('text');
                let groupText = '';
                textElements.forEach(text => { groupText += text.textContent.toLowerCase() + ' '; });
                if (searchText === '' || groupText.includes(searchText)) {
                    group.classList.remove('hidden');
                    // Reposition visible groups to remove blank rows 
                    const allElements = group.querySelectorAll('text, rect');
                    const originalY = parseFloat(textElements[0].getAttribute('y'));
                    const yOffset = currentY - originalY;
                    allElements.forEach(el => { const currentYVal = parseFloat(el.getAttribute('y')); el.setAttribute('y', currentYVal + yOffset); });
                    currentY += rowHeight; visibleCount++;
                } else {
                    group.classList.add('hidden');
                }
            });
            // Adjust SVG height based on visible items 
            svg.setAttribute('height', Math.max(visibleCount * rowHeight, 100));
            updateResultCount(visibleCount, groups.length);
        }
        filterBox.addEventListener('input', filterSVG);
        updateResultCount(groups.length, groups.length);

        // Add CSS for hidden class 
        const style = document.createElement('style');
        style.textContent = 'svg g.hidden { display: none; }';
        document.head.appendChild(style);
    }
};

//Add reset filters to 'All'

const addFocusEvtToFilters = () => {
    const filterBoxes = document.querySelectorAll('select');

    filterBoxes.forEach((selectElement, idx) => {
        selectElement.addEventListener('focus', function(event) {
            const filters = document.querySelectorAll('select');

            filters.forEach((selectFilter) => {
                //event.target.value = "1";
                selectFilter.selectedIndex = 0;
            });
            
            //console.log('trigger event focus!');
        });

    });
}

// initial 

init = () => {
    tbColHdr();
    injectChartAddFilter();

    // New Code :: Begin
    //const filterBoxes = document.querySelectorAll('select[id^="filter"]');
    const filterBoxes = document.querySelectorAll('select');

    var colIdx = 0;
    var oldArea = 'A';
    var curArea = 'B';

    filterBoxes.forEach((selectElement, idx) => {
       curArea = selectElement.parentElement?.id;
       const hasArea = curArea?.toLowerCase().includes('area') ?? false;

        if (hasArea) {
            if (oldArea != curArea) {
                oldArea = curArea;
                colIdx = 0;
            }
            tbColFilter(selectElement.id, colIdx++);
        } else {
            tbColFilter(selectElement.id, idx);
        }
    });
    // New Code :: End

    addFocusEvtToFilters();

    window.addEventListener('message', (event) => {
        if (event.data === 'EXPORT_PDF') {
            event.source.postMessage(`{PDF}${document.documentElement.outerHTML}`, event.origin);
        } else if (event.data === 'EXPORT_JSON') {
            var theJson = tbExport2Json();

            if (theJson) {
                event.source.postMessage(`{JSON}${theJson}`, event.origin);
            } else {
                alert('Table Not Found!');
            }
        } else if (event.data === 'EXPORT_CSV') {
            var theJson = tbExport2Json();

            if (theJson) {
                event.source.postMessage(`{CSV}${theJson}`, event.origin);
            } else {
                alert('Table Not Found!');
            }
        }
        event.cancelable;
    });

}

