const React = require('react');

const StorageBoxReport = ({ data }) => {
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Transform raw data into report structure
  const transformData = (rawData) => {
    if (!Array.isArray(rawData)) return [];
    
    return rawData.map((item, index) => {
      // Count number of items from storageDesc (split by commas)
      const itemCount = item.storageDesc 
        ? item.storageDesc.split(',').filter(s => s.trim()).length 
        : 0;
      
      // Count number of tags
      const tagCount = Array.isArray(item.tags) ? item.tags.length : 0;
      
      return {
        number: index + 1,
        locationName: item.locationName || 'N/A',
        boxName: item.storageName || 'N/A',
        barcode: item.barcode || 'N/A',
        numberOfItems: itemCount,
        numberOfTags: tagCount,
        rawData: item
      };
    });
  };

  const reportData = React.useMemo(() => transformData(data || []), [data]);

  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return reportData;

    const sorted = [...reportData].sort((a, b) => {
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
  };

  const sortedData = getSortedData();

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // Calculate summary statistics
  const totalBoxes = reportData.length;
  const totalItems = reportData.reduce((sum, item) => sum + item.numberOfItems, 0);
  const totalTags = reportData.reduce((sum, item) => sum + item.numberOfTags, 0);

  return React.createElement('div', { style: styles.container },
    React.createElement('div', { style: styles.header }, 'Storage Box Analysis Report'),
    React.createElement('div', { style: styles.subtitle }, 
      `Total: ${totalBoxes} boxes | ${totalItems} items | ${totalTags} tags`
    ),
    
    React.createElement('div', { style: { marginBottom: '20px', display: 'flex', gap: '10px' } },
      React.createElement('div', { style: {...styles.statCard, ...styles.cardInfo} },
        React.createElement('div', { style: styles.statNumber }, totalBoxes),
        React.createElement('div', { style: styles.statLabel }, 'Total Boxes')
      ),
      React.createElement('div', { style: {...styles.statCard, ...styles.cardSuccess} },
        React.createElement('div', { style: styles.statNumber }, totalItems),
        React.createElement('div', { style: styles.statLabel }, 'Total Items')
      ),
      React.createElement('div', { style: {...styles.statCard, ...styles.cardWarning} },
        React.createElement('div', { style: styles.statNumber }, totalTags),
        React.createElement('div', { style: styles.statLabel }, 'Total Tags')
      )
    ),

    React.createElement('table', { id: 'sortableTable', style: styles.table },
      React.createElement('thead', { style: styles.tableHeader },
        React.createElement('tr', null,
         // React.createElement('th', {onClick: () => {return;} }, ''),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => sortData('locationName')
          }, 'Location Name' + getSortIndicator('locationName')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => sortData('boxName')
          }, 'Box Name' + getSortIndicator('boxName')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => sortData('barcode')
          }, 'Barcode' + getSortIndicator('barcode')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => sortData('numberOfItems')
          }, 'Number of Items' + getSortIndicator('numberOfItems')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => sortData('numberOfTags')
          }, 'Number of Tags' + getSortIndicator('numberOfTags'))
        )
      ),
      React.createElement('tbody', null,
        sortedData.length === 0 
          ? React.createElement('tr', null,
              React.createElement('td', { colSpan: 5, style: {...styles.td, textAlign: 'center'} }, 
                'No data available'
              )
            )
          : sortedData.map((item, idx) =>
              React.createElement('tr', { key: idx },
                //React.createElement('td', { style: styles.td }, item.number),
                React.createElement('td', { style: styles.td }, item.locationName),
                React.createElement('td', { style: styles.td }, item.boxName),
                React.createElement('td', { style: styles.td }, item.barcode),
                React.createElement('td', { style: styles.td }, item.numberOfItems),
                React.createElement('td', { style: styles.td }, item.numberOfTags)
              )
            )
      )
    )
  );
};

module.exports = StorageBoxReport;