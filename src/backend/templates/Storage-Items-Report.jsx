const React = require('react');

const HousekeeperBeeReport = ({ data }) => {
  const [filterValue, setFilterValue] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Transform raw data into report structure
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData.map((item, index) => {
      // Parse storage items and count them
      const itemsList = item.storageDesc ? item.storageDesc.split(/,|，/).map(i => i.trim()) : [];
      
      let totalItems = 0;
      const processedItems = itemsList.map(itemStr => {
        // Match patterns like "3 x item", "item x 3", "3x item", etc.
        const match = itemStr.match(/(\d+)\s*[x×]\s*(.+)|(.+)\s*[x×]\s*(\d+)/i);
        
        if (match) {
          const quantity = parseInt(match[1] || match[4]);
          const itemName = (match[2] || match[3]).trim();
          totalItems += quantity;
          return `* ${quantity} x ${itemName}`;
        } else {
          totalItems += 1;
          return `* ${itemStr}`;
        }
      });

      return {
        number: index + 1,
        storageItems: processedItems.join('\n'),
        totalItems: totalItems,
        locationName: item.locationName || '',
        boxName: item.storageName || '',
        barcode: item.barcode || '',
        tags: item.tags ? item.tags.join(', ') : '',
        rawTags: item.tags || []
      };
    });
  };

  const reportData = React.useMemo(() => transformData(data), [data]);

  // Get unique tags for filter dropdown
  const uniqueTags = React.useMemo(() => {
    const tagSet = new Set();
    reportData.forEach(item => {
      item.rawTags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [reportData]);

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!filterValue) return reportData;
    return reportData.filter(item => item.rawTags.includes(filterValue));
  }, [reportData, filterValue]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const currentDate = new Date().toLocaleString();

  return React.createElement('div', { style: styles.container },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { style: styles.header }, 'Housekeeper Bee Storage Report'),
      React.createElement('div', { style: { fontSize: '14px', color: '#666' } }, currentDate)
    ),
    
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('label', { 
        htmlFor: 'filter-select',
        style: { marginRight: '10px', fontWeight: 'bold' }
      }, 'Filter by:'),
      React.createElement('select', {
        id: 'filter-select',
        value: filterValue,
        onChange: (e) => setFilterValue(e.target.value),
        style: { padding: '5px 10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc',  maxWidth: '600px;' }
      },
        React.createElement('option', { value: '' }, 'All'),
        uniqueTags.map(tag => 
          React.createElement('option', { key: tag, value: tag }, tag)
        )
      )
    ),

    React.createElement('div', { 
      style: {
        ...(styles.statCard || {}),
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #dee2e6'
      }
    },
      React.createElement('div', { 
        style: {
          ...(styles.statLabel || {}),
          fontSize: '14px',
          color: '#6c757d',
          marginBottom: '8px',
          fontWeight: '500'
        }
      }, 'Total Storage Boxes'),
      React.createElement('div', { 
        style: {
          ...(styles.statNumber || {}),
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#495057'
        }
      }, sortedData.length)
    ),

    React.createElement('table', { 
      id: 'sortableTable',
      style: { ...styles.table, marginTop: '20px' }
    },
      React.createElement('thead', { style: styles.tableHeader },
        React.createElement('tr', null,
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('number')
          }, '#' + getSortIndicator('number')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('storageItems')
          }, 'Storage Items' + getSortIndicator('storageItems')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('totalItems')
          }, 'Total Items' + getSortIndicator('totalItems')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('locationName')
          }, 'Location' + getSortIndicator('locationName')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('boxName')
          }, 'Box Name' + getSortIndicator('boxName')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('barcode')
          }, 'Barcode' + getSortIndicator('barcode')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('tags')
          }, 'Tags' + getSortIndicator('tags'))
        )
      ),
      React.createElement('tbody', null,
        sortedData.length === 0 ? 
          React.createElement('tr', null,
            React.createElement('td', { 
              colSpan: 7, 
              style: { ...styles.td, textAlign: 'center', padding: '20px' }
            }, 'No data available')
          ) :
          sortedData.map((row, idx) =>
            React.createElement('tr', { key: idx },
              React.createElement('td', { style: styles.td }, row.number),
              React.createElement('td', { 
                style: { ...styles.td, whiteSpace: 'pre-line', textAlign: 'left' }
              }, row.storageItems),
              React.createElement('td', { style: styles.td }, row.totalItems),
              React.createElement('td', { style: styles.td }, row.locationName),
              React.createElement('td', { style: styles.td }, row.boxName),
              React.createElement('td', { style: styles.td }, row.barcode),
              React.createElement('td', { style: styles.td }, row.tags)
            )
          )
      )
    )
  );
};

module.exports = HousekeeperBeeReport;