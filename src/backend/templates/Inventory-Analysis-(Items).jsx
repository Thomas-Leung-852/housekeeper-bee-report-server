const React = require('react');

const StorageAnalysisReport = ({ data }) => {
  // Transform raw data to report structure
  const processedData = React.useMemo(() => {
    return data.map((item, index) => {
      // Parse storage description to extract items
      const desc = item.storageDesc || '';
      const items = desc.split(/[,，]/).map(i => i.trim()).filter(i => i);
      
      // Count items with multipliers (N x item or item x N)
      let totalCount = 0;
      const processedItems = items.map(itemStr => {
        const xMatch = itemStr.match(/(\d+)\s*[x×]\s*(.+)|(.+)\s*[x×]\s*(\d+)/i);
        if (xMatch) {
          const count = parseInt(xMatch[1] || xMatch[4]);
          const itemName = (xMatch[2] || xMatch[3]).trim();
          totalCount += count;
          return `* ${count} x ${itemName}`;
        } else {
          totalCount += 1;
          return `* ${itemStr}`;
        }
      });
      
      // Parse box status to percentage
      let statusPercent = 0;
      const status = (item.storageStatus || '').toLowerCase();
      
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
        // Try to extract numeric percentage
        const percentMatch = status.match(/(\d+)%/);
        if (percentMatch) {
          statusPercent = parseInt(percentMatch[1]);
        }
      }
      
      return {
        index: index + 1,
        storageItems: processedItems.join('\n'),
        totalItems: totalCount,
        locationName: item.locationName,
        boxName: item.storageName,
        barcode: item.barcode || 'N/A',
        statusPercent: statusPercent,
        tags: (item.tags || []).join(', '),
        rawData: item
      };
    });
  }, [data]);

  // Get current date/time
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = processedData.length;
    const full = processedData.filter(d => d.statusPercent === 100).length;
    const empty = processedData.filter(d => d.statusPercent === 0).length;
    const partial = total - full - empty;
    const totalItems = processedData.reduce((sum, d) => sum + d.totalItems, 0);
    
    return { total, full, empty, partial, totalItems };
  }, [processedData]);

  // Sorting functionality
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [filterValue, setFilterValue] = React.useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sorted = [...processedData];
    
    if (sortConfig.key) {
      sorted.sort((a, b) => {
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
    }
    
    return sorted;
  }, [processedData, sortConfig]);

  // Filter functionality
  const filteredData = React.useMemo(() => {
    if (!filterValue) return sortedData;
    
    return sortedData.filter(item => {
      const searchStr = filterValue.toLowerCase();
      return (
        item.boxName.toLowerCase().includes(searchStr) ||
        item.locationName.toLowerCase().includes(searchStr) ||
        item.tags.toLowerCase().includes(searchStr) ||
        item.storageItems.toLowerCase().includes(searchStr)
      );
    });
  }, [sortedData, filterValue]);

  // Get unique filter options
  const filterOptions = React.useMemo(() => {
    const locations = [...new Set(processedData.map(d => d.locationName))];
    const allTags = processedData.flatMap(d => 
      d.tags.split(',').map(t => t.trim()).filter(t => t)
    );
    const uniqueTags = [...new Set(allTags)];
    
    return {
      locations: locations.sort(),
      tags: uniqueTags.sort()
    };
  }, [processedData]);

  const getProgressBarStyle = (percent) => {
    if (percent === 100) return styles.bar100;
    if (percent >= 75) return styles.bar75;
    if (percent >= 50) return styles.bar50;
    if (percent >= 25) return styles.bar25;
    return styles.bar0;
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('div', { style: styles.header },
      React.createElement('h1', null, 'Storage Box Analysis Report'),
      React.createElement('div', { style: { textAlign: 'right', fontSize: '14px', color: '#666' } },
        currentDateTime
      )
    ),
    
    React.createElement('div', { style: styles.subtitle },
      'Comprehensive analysis of storage box usage by items, location, and status'
    ),
    
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' } },
      React.createElement('div', { style: {...styles.statCard, ...styles.cardTotal} },
        React.createElement('div', { style: styles.statNumber }, stats.total),
        React.createElement('div', { style: styles.statLabel }, 'Total Boxes')
      ),
      React.createElement('div', { style: {...styles.statCard, ...styles.cardSuccess} },
        React.createElement('div', { style: styles.statNumber }, stats.full),
        React.createElement('div', { style: styles.statLabel }, 'Full (100%)')
      ),
      React.createElement('div', { style: {...styles.statCard, ...styles.cardWarning} },
        React.createElement('div', { style: styles.statNumber }, stats.partial),
        React.createElement('div', { style: styles.statLabel }, 'Partial (25-75%)')
      ),
      React.createElement('div', { style: {...styles.statCard, ...styles.cardDanger} },
        React.createElement('div', { style: styles.statNumber }, stats.empty),
        React.createElement('div', { style: styles.statLabel }, 'Empty (0%)')
      ),
      React.createElement('div', { style: {...styles.statCard, ...styles.cardInfo} },
        React.createElement('div', { style: styles.statNumber }, stats.totalItems),
        React.createElement('div', { style: styles.statLabel }, 'Total Items')
      )
    ),
    
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('label', { 
        htmlFor: 'filter-select',
        style: { marginRight: '10px', fontWeight: 'bold' }
      }, 'Filter by:'),
      React.createElement('select', {
        id: 'filter-select',
        style: { maxWidth: '900px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' },
        value: filterValue,
        onChange: (e) => setFilterValue(e.target.value)
      },
        React.createElement('option', { value: '' }, 'All'),
        React.createElement('optgroup', { label: 'Locations' },
          filterOptions.locations.map(loc => 
            React.createElement('option', { key: loc, value: loc }, loc)
          )
        ),
        React.createElement('optgroup', { label: 'Tags' },
          filterOptions.tags.map(tag => 
            React.createElement('option', { key: tag, value: tag }, tag)
          )
        )
      )
    ),
    
    React.createElement('table', { id: 'sortableTable', style: styles.table },
      React.createElement('thead', { style: styles.tableHeader },
        React.createElement('tr', null,
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('index')
          }, '# ' + (sortConfig.key === 'index' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('storageItems')
          }, 'Storage Items ' + (sortConfig.key === 'storageItems' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('totalItems')
          }, 'Total Items ' + (sortConfig.key === 'totalItems' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('locationName')
          }, 'Location ' + (sortConfig.key === 'locationName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('boxName')
          }, 'Box Name ' + (sortConfig.key === 'boxName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('barcode')
          }, 'Barcode ' + (sortConfig.key === 'barcode' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('statusPercent')
          }, 'Status ' + (sortConfig.key === 'statusPercent' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')),
          React.createElement('th', { 
            style: {...styles.th, cursor: 'pointer'}, 
            onClick: () => handleSort('tags')
          }, 'Tags ' + (sortConfig.key === 'tags' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''))
        )
      ),
      React.createElement('tbody', null,
        filteredData.map((item) => 
          React.createElement('tr', { key: item.index },
            React.createElement('td', { style: styles.td }, item.index),
            React.createElement('td', { style: {...styles.td, whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '12px'} }, 
              item.storageItems
            ),
            React.createElement('td', { style: {...styles.td, textAlign: 'center', fontWeight: 'bold'} }, 
              item.totalItems
            ),
            React.createElement('td', { style: styles.td }, item.locationName),
            React.createElement('td', { style: styles.td }, item.boxName),
            React.createElement('td', { style: {...styles.td, fontFamily: 'monospace'} }, item.barcode),
            React.createElement('td', { style: styles.td },
              React.createElement('div', { style: styles.progressBar },
                React.createElement('div', { 
                  style: {
                    ...styles.bar,
                    ...getProgressBarStyle(item.statusPercent),
                    width: `${item.statusPercent}%`
                  }
                }, `${item.statusPercent}%`)
              )
            ),
            React.createElement('td', { style: {...styles.td, fontSize: '11px', color: '#555'} }, 
              item.tags
            )
          )
        )
      )
    ),
    
    React.createElement('div', { style: { marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' } },
      `Showing ${filteredData.length} of ${processedData.length} boxes`
    )
  );
};

module.exports = StorageAnalysisReport;