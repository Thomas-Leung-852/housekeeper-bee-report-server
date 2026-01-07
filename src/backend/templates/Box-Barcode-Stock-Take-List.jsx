/**
 * Housekeeper Bee Report - Box Barcode Stock Take List
 * AI Assistant: Claude
 * AI Model: Claude Sonnet 4.5
 * Report Created: 2025-01-04
 */

const React = require('react');

const HousekeeperBeeReport = ({ data }) => {
  const startTime = Date.now();

  // Filter boxes with barcodes
  const boxesWithBarcodes = data.filter(item => item.barcode && item.barcode.trim() !== '');
  
  // Calculate summary statistics
  const totalBoxes = boxesWithBarcodes.length;
  const statusCounts = {
    full: 0,
    high: 0,
    medium: 0,
    low: 0,
    empty: 0
  };

  // Count items and categorize by status
  boxesWithBarcodes.forEach(item => {
    const status = (item.storageStatus || '').toLowerCase();
    let statusPercent = 0;
    
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
    } else {
      const percentMatch = status.match(/(\d+)%/);
      if (percentMatch) {
        statusPercent = parseInt(percentMatch[1]);
      }
    }

    if (statusPercent === 100) statusCounts.full++;
    else if (statusPercent >= 75) statusCounts.high++;
    else if (statusPercent >= 50) statusCounts.medium++;
    else if (statusPercent > 0) statusCounts.low++;
    else statusCounts.empty++;
  });

  // Count total items
  const totalItems = boxesWithBarcodes.reduce((sum, item) => {
    const desc = item.storageDesc || '';
    const items = desc.split(/,|，/).map(i => i.trim()).filter(i => i);
    return sum + items.reduce((itemSum, itemText) => {
      const match = itemText.match(/(\d+)\s*x\s*|x\s*(\d+)/i);
      return itemSum + (match ? parseInt(match[1] || match[2]) : 1);
    }, 0);
  }, 0);

  // Get unique locations
  const uniqueLocations = [...new Set(boxesWithBarcodes.map(item => item.locationName))];

  // Format items with line breaks and asterisks
  const formatItems = (desc) => {
    if (!desc) return 'No items';
    const items = desc.split(/,|，/).map(i => i.trim()).filter(i => i);
    return items.map((item, idx) => 
      React.createElement('div', { key: idx }, `• ${item}`)
    );
  };

  // Count items in description
  const countItems = (desc) => {
    if (!desc) return 0;
    const items = desc.split(/,|，/).map(i => i.trim()).filter(i => i);
    return items.reduce((sum, itemText) => {
      const match = itemText.match(/(\d+)\s*x\s*|x\s*(\d+)/i);
      return sum + (match ? parseInt(match[1] || match[2]) : 1);
    }, 0);
  };

  // Get status bar style
  const getStatusBarStyle = (status) => {
    const statusLower = (status || '').toLowerCase();
    let statusPercent = 0;
    
    if (statusLower.includes('25% occupied')) {
      statusPercent = 25;
    } else if (statusLower.includes('50% occupied')) {
      statusPercent = 50;
    } else if (statusLower.includes('75% occupied')) {
      statusPercent = 75;
    } else if (statusLower.includes('fully') || statusLower.includes('full') || statusLower.includes('100%')) {
      statusPercent = 100;
    } else if (statusLower.includes('empty') || statusLower.includes('0%')) {
      statusPercent = 0;
    } else {
      const percentMatch = statusLower.match(/(\d+)%/);
      if (percentMatch) {
        statusPercent = parseInt(percentMatch[1]);
      }
    }

    if (statusPercent === 100) return styles.bar100;
    if (statusPercent >= 75) return styles.bar75;
    if (statusPercent >= 50) return styles.bar50;
    if (statusPercent > 0) return styles.bar25;
    return styles.bar0;
  };

  // Sorting state management
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [filterLocation, setFilterLocation] = React.useState('');

  // Sort data
  let sortedData = [...boxesWithBarcodes];
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      let aVal = a[sortConfig.key] || '';
      let bVal = b[sortConfig.key] || '';
      
      if (sortConfig.key === 'itemCount') {
        aVal = countItems(a.storageDesc);
        bVal = countItems(b.storageDesc);
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Filter data
  if (filterLocation) {
    sortedData = sortedData.filter(item => item.locationName === filterLocation);
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const endTime = Date.now();
  const duration = endTime - startTime;

  return React.createElement('div', { style: styles.container },
    // Header Section
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' } },
      React.createElement('div', null,
        React.createElement('h1', { style: styles.header }, 'Housekeeper Bee Report'),
        React.createElement('p', { style: styles.subtitle }, 'Box Barcode Stock Take List')
      ),
      React.createElement('div', { style: { textAlign: 'right', fontSize: '0.85rem', color: '#666' } },
        React.createElement('div', null, new Date().toLocaleString()),
        React.createElement('div', null, 'Report Template Created by:'),
        React.createElement('div', null, 'Claude Sonnet 4.5'),
        React.createElement('div', null, 'Claude'),
        React.createElement('div', null, `Duration: ${duration}ms`)
      )
    ),

    // Summary Cards Section
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' } },
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardTotal } },
        React.createElement('div', { style: styles.statNumber }, totalBoxes),
        React.createElement('div', { style: styles.statLabel }, 'Total Boxes')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardSuccess } },
        React.createElement('div', { style: styles.statNumber }, totalItems),
        React.createElement('div', { style: styles.statLabel }, 'Total Items')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardInfo } },
        React.createElement('div', { style: styles.statNumber }, uniqueLocations.length),
        React.createElement('div', { style: styles.statLabel }, 'Locations')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardWarning } },
        React.createElement('div', { style: styles.statNumber }, statusCounts.full),
        React.createElement('div', { style: styles.statLabel }, 'Full Boxes')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardDanger } },
        React.createElement('div', { style: styles.statNumber }, statusCounts.empty),
        React.createElement('div', { style: styles.statLabel }, 'Empty Boxes')
      )
    ),

    // Card View Section
    React.createElement('h2', { style: { ...styles.header, fontSize: '1.8rem', marginBottom: '20px' } }, 'Boxes with Barcodes'),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' } },
      boxesWithBarcodes.map((box, idx) =>
        React.createElement('div', { 
          key: idx, 
          style: { 
            background: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          } 
        },
          React.createElement('div', { style: { textAlign: 'center', marginBottom: '15px' } },
            box.barcode ? React.createElement('img', {
              alt: 'Barcode',
              src: `[!MY_API_SRV]/api/barcode/ean13?data=${box.barcode}`,
              style: { maxWidth: '100%', height: 'auto' }
            }) : React.createElement('span', null, 'No Barcode'),
            React.createElement('div', { style: { fontFamily: 'monospace', marginTop: '5px', fontSize: '0.9rem' } }, box.barcode)
          ),
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('strong', null, 'Box Name: '),
            box.storageName
          ),
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('strong', null, 'Location: '),
            box.locationName
          ),
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('strong', null, 'Status: '),
            box.storageStatus
          ),
          React.createElement('div', { style: styles.progressBar },
            React.createElement('div', { style: { ...styles.bar, ...getStatusBarStyle(box.storageStatus), width: '100%' } })
          )
        )
      )
    ),

    // Filter Section
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('label', { htmlFor: 'filter-select', style: { marginRight: '10px' } }, 'Filter by:'),
      React.createElement('select', {
        id: 'filter-select',
        style: { maxWidth: '900px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' },
        value: filterLocation,
        onChange: (e) => setFilterLocation(e.target.value)
      },
        React.createElement('option', { value: '' }, 'All'),
        uniqueLocations.map((loc, idx) =>
          React.createElement('option', { key: idx, value: loc }, loc)
        )
      )
    ),

    // Detailed Table Section
    React.createElement('h2', { style: { ...styles.header, fontSize: '1.8rem', marginBottom: '20px' } }, 'Detailed Box Information'),
    React.createElement('table', { id: 'sortableTable', style: styles.table },
      React.createElement('thead', { style: styles.tableHeader },
        React.createElement('tr', null,
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('barcode')
          }, 'Barcode ', sortConfig.key === 'barcode' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('locationName')
          }, 'Location ', sortConfig.key === 'locationName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('storageName')
          }, 'Box Name ', sortConfig.key === 'storageName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''),
          React.createElement('th', { style: styles.th }, 'Items'),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('itemCount')
          }, 'Item Count ', sortConfig.key === 'itemCount' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('storageStatus')
          }, 'Status ', sortConfig.key === 'storageStatus' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')
        )
      ),
      React.createElement('tbody', null,
        sortedData.map((row, idx) =>
          React.createElement('tr', { key: idx },
            React.createElement('td', { style: { ...styles.td, fontFamily: 'monospace', fontSize: '0.9rem', textAlign: 'center' } },
              row.barcode ? React.createElement('img', {
                alt: '',
                src: `[!MY_API_SRV]/api/barcode/ean13?data=${row.barcode}`
              }) : React.createElement('span', null, 'No Barcode'),
              React.createElement('br'),
              row.barcode
            ),
            React.createElement('td', { style: styles.td }, row.locationName),
            React.createElement('td', { style: styles.td }, row.storageName),
            React.createElement('td', { style: styles.td }, formatItems(row.storageDesc)),
            React.createElement('td', { style: { ...styles.td, textAlign: 'center' } }, countItems(row.storageDesc)),
            React.createElement('td', { style: styles.td },
              React.createElement('div', null, row.storageStatus),
              React.createElement('div', { style: { ...styles.progressBar, marginTop: '8px' } },
                React.createElement('div', { style: { ...styles.bar, ...getStatusBarStyle(row.storageStatus), width: '100%' } })
              )
            )
          )
        )
      )
    ),

    // Summary Statistics Section
    React.createElement('div', { style: { marginTop: '40px' } },
      React.createElement('h2', { style: { ...styles.header, fontSize: '1.8rem', marginBottom: '20px' } }, 'Status Distribution'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' } },
        React.createElement('div', { style: { padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: '#84cc16' } }, statusCounts.full),
          React.createElement('div', { style: { fontSize: '0.9rem', marginTop: '5px' } }, 'Full (100%)')
        ),
        React.createElement('div', { style: { padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' } }, statusCounts.high),
          React.createElement('div', { style: { fontSize: '0.9rem', marginTop: '5px' } }, 'High (75%)')
        ),
        React.createElement('div', { style: { padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: '#fb923c' } }, statusCounts.medium),
          React.createElement('div', { style: { fontSize: '0.9rem', marginTop: '5px' } }, 'Medium (50%)')
        ),
        React.createElement('div', { style: { padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: '#fdba74' } }, statusCounts.low),
          React.createElement('div', { style: { fontSize: '0.9rem', marginTop: '5px' } }, 'Low (<50%)')
        ),
        React.createElement('div', { style: { padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: '#fef3c7' } }, statusCounts.empty),
          React.createElement('div', { style: { fontSize: '0.9rem', marginTop: '5px' } }, 'Empty (0%)')
        )
      )
    )
  );
};

module.exports = HousekeeperBeeReport;