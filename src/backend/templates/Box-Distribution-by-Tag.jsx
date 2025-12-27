const React = require('react');
const { useState, useMemo } = React;

const HousekeeperTagReport = ({ data }) => {
  const [filterTag, setFilterTag] = useState('');
  
  // Transform raw data to report structure
  const reportData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    const tagMap = new Map();
    
    data.forEach(item => {
      const tags = item.tags || [];
      
      tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            tag: tag,
            count: 0,
            boxes: []
          });
        }
        
        const tagData = tagMap.get(tag);
        tagData.count += 1;
        tagData.boxes.push({
          name: item.storageName || 'Unnamed Box',
          code: item.storageCode,
          desc: item.storageDesc || ''
        });
      });
    });
    
    // Convert map to array and sort by count descending
    const result = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
    return result;
  }, [data]);
  
  // Filter data based on selected tag
  const filteredData = useMemo(() => {
    if (!filterTag) return reportData;
    return reportData.filter(item => item.tag === filterTag);
  }, [reportData, filterTag]);
  
  // Get current date/time
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Calculate max count for chart scaling
  const maxCount = Math.max(...reportData.map(item => item.count), 1);
  
  // Sort table function
  const sortTable = (columnIndex) => {
    const table = document.getElementById('sortableTable');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const sorted = rows.sort((a, b) => {
      let aVal = a.cells[columnIndex].textContent.trim();
      let bVal = b.cells[columnIndex].textContent.trim();
      
      // If numeric column, parse as number
      if (columnIndex === 0 || columnIndex === 2) {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
        return aVal - bVal;
      }
      
      // String comparison
      return aVal.localeCompare(bVal);
    });
    
    // Clear and re-append
    tbody.innerHTML = '';
    sorted.forEach(row => tbody.appendChild(row));
  };
  
  return React.createElement('div', { style: styles.container },
    // Header with date/time
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h2', { style: styles.header }, 'Storage Box Analysis by Tag'),
      React.createElement('div', { style: { fontSize: '14px', color: '#666' } }, currentDateTime)
    ),
    
    // Summary stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' } },
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardInfo } },
        React.createElement('div', { style: styles.statNumber }, reportData.length),
        React.createElement('div', { style: styles.statLabel }, 'Total Tags')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardSuccess } },
        React.createElement('div', { style: styles.statNumber }, data ? data.length : 0),
        React.createElement('div', { style: styles.statLabel }, 'Total Boxes')
      )
    ),
    
    // Filter dropdown
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('label', { 
        htmlFor: 'filter-select',
        style: { marginRight: '10px', fontWeight: 'bold' }
      }, 'Filter by:'),
      React.createElement('select', {
        id: 'filter-select',
        style: { maxWidth: '900px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' },
        value: filterTag,
        onChange: (e) => setFilterTag(e.target.value)
      },
        React.createElement('option', { value: '' }, 'All'),
        reportData.map(item => 
          React.createElement('option', { key: item.tag, value: item.tag }, item.tag)
        )
      )
    ),
    
    // Data table
    React.createElement('table', { id: 'sortableTable', style: styles.table },
      React.createElement('thead', null,
        React.createElement('tr', { style: styles.tableHeader },
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => sortTable(0)
          }, '#'),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => sortTable(1)
          }, 'Tag'),
          React.createElement('th', { 
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => sortTable(2)
          }, 'Number of Boxes'),
          React.createElement('th', { style: styles.th }, 'Boxes Name')
        )
      ),
      React.createElement('tbody', null,
        filteredData.map((item, index) =>
          React.createElement('tr', { key: item.tag },
            React.createElement('td', { style: styles.td }, index + 1),
            React.createElement('td', { style: styles.td }, item.tag),
            React.createElement('td', { style: styles.td }, item.count),
            React.createElement('td', { style: { ...styles.td, whiteSpace: 'pre-line' } },
              item.boxes.map(box => `• ${box.name}`).join('\n')
            )
          )
        )
      )
    ),
    
    // Bar chart using SVG
    React.createElement('div', { style: { marginTop: '40px' } },
      React.createElement('h3', { style: { ...styles.subtitle, marginBottom: '20px' } }, 'Tag Distribution Chart'),
      React.createElement('svg', {
        width: '100%',
        height: filteredData.length * 40 + 20,
        style: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px', backgroundColor: '#fafafa' }
      },
        filteredData.map((item, index) => {
          const barWidth = (item.count / maxCount) * 60; // 60% of width for bar
          const y = index * 40 + 10;
          
          // Determine bar color based on percentage
          let barColor = '#9e9e9e';
          const barPercent = (item.count / maxCount) * 100;
          if (barPercent === 100) barColor = '#4caf50';
          else if (barPercent >= 75) barColor = '#8bc34a';
          else if (barPercent >= 50) barColor = '#ffc107';
          else if (barPercent >= 25) barColor = '#ff9800';
          else barColor = '#f44336';
          
          return React.createElement('g', { key: item.tag },
            // Tag label
            React.createElement('text', {
              x: '10',
              y: y + 18,
              style: { fontSize: '14px', fontWeight: '500', fill: '#333' }
            }, item.tag),
            
            // Bar background
            React.createElement('rect', {
              x: '25%',
              y: y,
              width: '60%',
              height: '25',
              fill: '#e0e0e0',
              rx: '4'
            }),
            
            // Bar foreground
            React.createElement('rect', {
              x: '25%',
              y: y,
              width: `${barWidth}%`,
              height: '25',
              fill: barColor,
              rx: '4'
            },
              React.createElement('animate', {
                attributeName: 'width',
                from: '0%',
                to: `${barWidth}%`,
                dur: '0.5s',
                fill: 'freeze'
              })
            ),
            
            // Count label
            React.createElement('text', {
              x: '87%',
              y: y + 18,
              style: { fontSize: '14px', fontWeight: 'bold', fill: '#333' }
            }, item.count)
          );
        })
      )
    )
  );
};

module.exports = HousekeeperTagReport;