const React = require('react');

const StorageBoxReport = ({ data }) => {
  const [filterTag, setFilterTag] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Transform raw data to report structure - group by tag
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    const result = [];
    let rowNumber = 1;

    rawData.forEach((item) => {
      // Split storage items by comma or Chinese comma
      const itemsArray = item.storageDesc
        ? item.storageDesc.split(/[,，]/).map(s => s.trim()).filter(s => s)
        : [];

      // Count items - handle both "N x item" and "item x N" formats
      let totalCount = 0;
      const processedItems = itemsArray.map(itemStr => {
        // Match patterns: "N x item" or "item x N"
        const matchPrefix = itemStr.match(/^(\d+)\s*x\s*(.+)$/i);
        const matchSuffix = itemStr.match(/^(.+?)\s*x\s*(\d+)$/i);
        
        if (matchPrefix) {
          // Format: "5 x Type-C cable"
          const count = parseInt(matchPrefix[1], 10);
          totalCount += count;
          return `* ${matchPrefix[2]} (×${count})`;
        } else if (matchSuffix) {
          // Format: "Type-C cable x 5"
          const count = parseInt(matchSuffix[2], 10);
          totalCount += count;
          return `* ${matchSuffix[1]} (×${count})`;
        } else {
          // No multiplier, count as 1
          totalCount += 1;
          return `* ${itemStr}`;
        }
      });

      const storeItemsFormatted = processedItems.join('\n');

      // Split tags by comma or Chinese comma if needed
      const tags = item.tags || [];
      const tagArray = Array.isArray(tags) ? tags : tags.split(/[,，]/).map(s => s.trim()).filter(s => s);

      // Create one row per tag
      if (tagArray.length > 0) {
        tagArray.forEach(tag => {
          result.push({
            number: rowNumber++,
            tag: tag,
            boxName: item.storageName || '',
            locationName: item.locationName || '',
            storeItems: storeItemsFormatted,
            totalItems: totalCount
          });
        });
      } else {
        // If no tags, create one row with empty tag
        result.push({
          number: rowNumber++,
          tag: '',
          boxName: item.storageName || '',
          locationName: item.locationName || '',
          storeItems: storeItemsFormatted,
          totalItems: totalCount
        });
      }
    });

    return result;
  };

  const reportData = transformData(data);

  // Get unique tags for filter
  const allTags = React.useMemo(() => {
    const tagSet = new Set();
    reportData.forEach(item => {
      if (item.tag) tagSet.add(item.tag);
    });
    return Array.from(tagSet).sort();
  }, [reportData]);

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!filterTag) return reportData;
    return reportData.filter(item => item.tag === filterTag);
  }, [reportData, filterTag]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
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

  const currentDateTime = new Date().toLocaleString();

  return React.createElement('div', { style: styles.container },
    // Header
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('div', null,
        React.createElement('h1', { style: styles.header }, 'Storage Box Usage Report'),
        React.createElement('p', { style: styles.subtitle }, 'Analysis by Tag')
      ),
      React.createElement('div', { style: { textAlign: 'right', fontSize: '14px', color: '#666' } },
        currentDateTime
      )
    ),

    // Filter
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('label', { htmlFor: 'filter-select', style: { marginRight: '10px', fontWeight: 'bold' } }, 'Filter by:'),
      React.createElement('select', {
        id: 'filter-select',
        value: filterTag,
        onChange: (e) => setFilterTag(e.target.value),
        style: { padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }
      },
        React.createElement('option', { value: '' }, 'All'),
        allTags.map(tag =>
          React.createElement('option', { key: tag, value: tag }, tag)
        )
      )
    ),

    // Summary Stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' } },
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardInfo } },
        React.createElement('div', { style: styles.statNumber }, sortedData.length),
        React.createElement('div', { style: styles.statLabel }, 'Total Records')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardSuccess } },
        React.createElement('div', { style: styles.statNumber }, 
          sortedData.reduce((sum, item) => sum + item.totalItems, 0)
        ),
        React.createElement('div', { style: styles.statLabel }, 'Total Items')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardWarning } },
        React.createElement('div', { style: styles.statNumber }, allTags.length),
        React.createElement('div', { style: styles.statLabel }, 'Unique Tags')
      )
    ),

    // Table
    React.createElement('table', { id: 'sortableTable', style: styles.table },
      React.createElement('thead', { style: styles.tableHeader },
        React.createElement('tr', null,
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer', userSelect: 'none' },
            onClick: () => handleSort('number')
          }, '#' + getSortIndicator('number')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer', userSelect: 'none' },
            onClick: () => handleSort('tag')
          }, 'Tag' + getSortIndicator('tag')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer', userSelect: 'none' },
            onClick: () => handleSort('boxName')
          }, 'Box Name' + getSortIndicator('boxName')),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer', userSelect: 'none' },
            onClick: () => handleSort('locationName')
          }, 'Location Name' + getSortIndicator('locationName')),
          React.createElement('th', { style: styles.th }, 'Store Items'),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer', userSelect: 'none' },
            onClick: () => handleSort('totalItems')
          }, 'Total Items' + getSortIndicator('totalItems'))
        )
      ),
      React.createElement('tbody', null,
        sortedData.map((row, idx) =>
          React.createElement('tr', { key: idx },
            React.createElement('td', { style: styles.td }, row.number),
            React.createElement('td', { style: styles.td }, row.tag),
            React.createElement('td', { style: styles.td }, row.boxName),
            React.createElement('td', { style: styles.td }, row.locationName),
            React.createElement('td', { 
              style: { 
                ...styles.td, 
                maxWidth: '150px', 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',
                fontSize: '13px'
              } 
            }, row.storeItems),
            React.createElement('td', { style: { ...styles.td, textAlign: 'center', fontWeight: 'bold' } }, row.totalItems)
          )
        )
      )
    )
  );
};

module.exports = StorageBoxReport;