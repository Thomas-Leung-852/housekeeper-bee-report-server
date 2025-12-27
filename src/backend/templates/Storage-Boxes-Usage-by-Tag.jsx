const React = require('react');
const { useState, useMemo } = React;

const HousekeeperTagReport = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterTag, setFilterTag] = useState('');

  // Transform raw data to report structure - expand each tag into separate rows
  const reportData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    const rows = [];
    let rowNumber = 0;
    
    data.forEach((storage) => {
      const tags = storage.tags || [];
      const locationName = storage.locationName || 'N/A';
      const boxName = storage.storageName || 'N/A';
      const storedItems = storage.storageDesc || 'No items';
      
      if (tags.length === 0) {
        // Box has no tags
        rows.push({
          id: `${storage.storageCode}-notag`,
          number: ++rowNumber,
          tagName: 'No tag',
          locationName: locationName,
          boxName: boxName,
          storedItems: storedItems
        });
      } else {
        // Create a row for each tag
        tags.forEach((tag) => {
          rows.push({
            id: `${storage.storageCode}-${tag}`,
            number: ++rowNumber,
            tagName: tag,
            locationName: locationName,
            boxName: boxName,
            storedItems: storedItems
          });
        });
      }
    });
    
    return rows;
  }, [data]);

  // Get unique tags for filter dropdown
  const uniqueTags = useMemo(() => {
    const tags = new Set();
    reportData.forEach(row => {
      if (row.tagName && row.tagName !== 'No tag') {
        tags.add(row.tagName);
      }
    });
    return Array.from(tags).sort();
  }, [reportData]);

  // Apply filter
  const filteredData = useMemo(() => {
    if (!filterTag) return reportData;
    return reportData.filter(row => row.tagName === filterTag);
  }, [reportData, filterTag]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
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
    if (sortConfig.key !== key) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const handleFilterChange = (e) => {
    setFilterTag(e.target.value);
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('h1', { style: styles.header }, 'Storage Boxes Usage by Tag'),
    React.createElement('p', { style: styles.subtitle }, 
      `Total Rows: ${sortedData.length} | Total Boxes: ${data ? data.length : 0}`
    ),
    
    // Filter section
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('label', { htmlFor: 'filter-select', style: { marginRight: '10px' } }, 'Filter by:'),
      React.createElement('select', { 
        id: 'filter-select',
        value: filterTag,
        onChange: handleFilterChange,
        style: { padding: '5px 10px', fontSize: '14px' }
      },
        React.createElement('option', { value: '' }, 'All'),
        uniqueTags.map(tag => 
          React.createElement('option', { key: tag, value: tag }, tag)
        )
      )
    ),
    
    React.createElement('table', { id: 'sortableTable', style: styles.table },
      React.createElement('thead', { style: styles.tableHeader },
        React.createElement('tr', null,
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('number')
          }, '#' + getSortIndicator('number')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('tagName')
          }, 'Tag Name' + getSortIndicator('tagName')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('locationName')
          }, 'Location Name' + getSortIndicator('locationName')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('boxName')
          }, 'Box Name' + getSortIndicator('boxName')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('storedItems')
          }, 'Stored Items' + getSortIndicator('storedItems'))
        )
      ),
      React.createElement('tbody', null,
        sortedData.map(row =>
          React.createElement('tr', { key: row.id },
            React.createElement('td', { style: styles.td }, row.number),
            React.createElement('td', { style: styles.td }, row.tagName),
            React.createElement('td', { style: styles.td }, row.locationName),
            React.createElement('td', { style: styles.td }, row.boxName),
            React.createElement('td', { style: styles.td }, row.storedItems)
          )
        )
      )
    )
  );
};

module.exports = HousekeeperTagReport;