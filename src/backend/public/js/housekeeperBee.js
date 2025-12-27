// inject the table column sorting to table id = sortableTable
tbColHdr = () => {
    const table = document.getElementById('sortableTable'); // Ensure your table has this ID in the document

    if (table != null) {
        const headers = table.querySelectorAll('th');

        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                const rows = Array.from(table.rows).slice(1); // Get all rows except the header
                const isAscending = header.classList.toggle('asc');

                rows.sort((a, b) => {
                    const aText = a.cells[index].textContent.trim();
                    const bText = b.cells[index].textContent.trim();

                    const aValue = isNaN(aText) ? aText : parseFloat(aText); // Convert to number or keep string
                    const bValue = isNaN(bText) ? bText : parseFloat(bText); // Convert to number or keep string

                    if (aValue < bValue) {
                        return isAscending ? -1 : 1; // Ascending or descending sort
                    }
                    if (aValue > bValue) {
                        return isAscending ? 1 : -1; // Ascending or descending sort
                    }
                    return 0; // Values are equal
                });

                rows.forEach(row => table.appendChild(row)); // Reorder rows in the table
            });
        });
    }
}

// inject the table column filter to table id = sortableTable
tbColFilter = () => {
    const filterSelect = document.getElementById('filter-select');

    if (filterSelect == null) {
        return;
    }

    filterSelect.innerText = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'All';
    filterSelect.appendChild(option);

    const dataTable = document.getElementById('sortableTable');

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
            const categoryCell = rows[i].getElementsByTagName('td')[1]; // Change index for different columns
            if (categoryCell) {
                if (filterValue === '' || categoryCell.textContent === filterValue) {
                    rows[i].style.display = ''; // Show row
                } else {
                    rows[i].style.display = 'none'; // Hide row
                }
            }
        }
    }

    if (filterSelect) {
        // Initial population of filter options for the specified column index
        populateFilterOptions(1); // Change 1 to the desired column index for filtering (0-based)

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


init = () => {
    tbColHdr();
    tbColFilter();

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


