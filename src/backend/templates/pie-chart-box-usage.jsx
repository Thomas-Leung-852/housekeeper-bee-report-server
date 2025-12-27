const React = require('react');

const StorageBoxUsageReport = ({ data }) => {
  // Parse item count from description
  const parseItemCount = (desc) => {
    if (!desc || desc.trim() === '') return 0;
    
    let totalCount = 0;
    const items = desc.split(/[,，]/);
    
    items.forEach(item => {
      const trimmedItem = item.trim();
      if (!trimmedItem) return;
      
      const match = trimmedItem.match(/(\d+)\s*[xX×]\s*(.+)|(.+)\s*[xX×]\s*(\d+)/);
      
      if (match) {
        const count = parseInt(match[1] || match[4]);
        totalCount += count;
      } else {
        totalCount += 1;
      }
    });
    
    return totalCount;
  };

  // Format description with bullets and line breaks
  const formatDescription = (desc) => {
    if (!desc || desc.trim() === '') return '';
    
    const items = desc.split(/[,，]/).map(item => item.trim()).filter(item => item);
    return items.map(item => `* ${item}`).join('\n');
  };

  // Process data - each box is a separate entry
  const processedData = data.map((box, index) => {
    const itemCount = parseItemCount(box.storageDesc);
    return {
      rowNumber: index + 1,
      storageCode: box.storageCode,
      locationName: box.locationName,
      storageName: box.storageName,
      storageItemsName: formatDescription(box.storageDesc),
      totalItems: itemCount,
      tags: box.tags || []
    };
  }).filter(box => box.totalItems > 0); // Only boxes with items

  // Sort by total items descending
  processedData.sort((a, b) => b.totalItems - a.totalItems);
  
  // Renumber after sorting
  processedData.forEach((box, index) => {
    box.rowNumber = index + 1;
  });

  // Calculate total items
  const totalItems = processedData.reduce((sum, box) => sum + box.totalItems, 0);

  // Add percentage to each box
  processedData.forEach(box => {
    box.percentage = ((box.totalItems / totalItems) * 100).toFixed(1);
  });

  // Generate unique colors for each box
  const generateColors = (count) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
      '#EF476F', '#06FFA5', '#118AB2', '#FFD60A', '#F72585',
      '#4CC9F0', '#7209B7', '#560BAD', '#3A0CA3', '#4361EE',
      '#F72585', '#B5179E', '#7209B7', '#560BAD', '#480CA8',
      '#3A0CA3', '#3F37C9', '#4361EE', '#4895EF', '#4CC9F0',
      '#FF8C42', '#C44569', '#F8B739', '#38A3A5', '#80ED99',
      '#22A699', '#F7A440', '#A7226E', '#EC2049', '#26C485'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  };

  const COLORS = generateColors(processedData.length);

  // Current date/time
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate SVG pie chart
  const createPieChart = () => {
    const radius = 150;
    const centerX = 200;
    const centerY = 200;
    let currentAngle = -90;

    const slices = processedData.map((box, idx) => {
      const percentage = box.totalItems / totalItems;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      const labelAngle = startAngle + angle / 2;
      const labelRad = (labelAngle * Math.PI) / 180;
      const labelRadius = radius * 0.7;
      const labelX = centerX + labelRadius * Math.cos(labelRad);
      const labelY = centerY + labelRadius * Math.sin(labelRad);

      currentAngle = endAngle;

      return {
        path: pathData,
        color: COLORS[idx],
        label: percentage >= 0.05 ? `${(percentage * 100).toFixed(1)}%` : '',
        labelX,
        labelY,
        name: box.storageName,
        value: box.totalItems
      };
    });

    return React.createElement('svg', {
      width: '100%',
      height: '400',
      viewBox: '0 0 400 400',
      style: { maxWidth: '600px', margin: '0 auto', display: 'block' }
    }, [
      ...slices.map((slice, idx) => 
        React.createElement('path', {
          key: `slice-${idx}`,
          d: slice.path,
          fill: slice.color,
          stroke: 'white',
          strokeWidth: 2
        })
      ),
      ...slices.filter(s => s.label).map((slice, idx) => 
        React.createElement('text', {
          key: `label-${idx}`,
          x: slice.labelX,
          y: slice.labelY,
          textAnchor: 'middle',
          dominantBaseline: 'middle',
          fill: 'white',
          fontWeight: 'bold',
          fontSize: '12'
        }, slice.label)
      )
    ]);
  };

  return React.createElement('div', null, [
    React.createElement('script', { 
      key: 'script',
      dangerouslySetInnerHTML: { __html: `
        function initTable() {
          const table = document.getElementById('sortableTable');
          if (!table) return;
          
          let sortConfig = { key: null, direction: 'asc' };
          let filterBox = '';
          
          const headers = table.querySelectorAll('th[data-sort]');
          headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            header.addEventListener('click', () => {
              const key = header.getAttribute('data-sort');
              if (sortConfig.key === key && sortConfig.direction === 'asc') {
                sortConfig.direction = 'desc';
              } else {
                sortConfig.direction = 'asc';
              }
              sortConfig.key = key;
              sortTable(key, sortConfig.direction);
              updateHeaders();
            });
          });
          
          const filterSelect = document.getElementById('filter-select');
          if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
              filterBox = e.target.value;
              filterTable(filterBox);
            });
          }
          
          function updateHeaders() {
            headers.forEach(h => {
              const key = h.getAttribute('data-sort');
              const arrow = h.querySelector('.sort-arrow');
              if (arrow) arrow.remove();
              if (key === sortConfig.key) {
                const span = document.createElement('span');
                span.className = 'sort-arrow';
                span.textContent = sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
                h.appendChild(span);
              }
            });
          }
          
          function sortTable(key, direction) {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.sort((a, b) => {
              let aVal = a.getAttribute('data-' + key);
              let bVal = b.getAttribute('data-' + key);
              
              if (key === 'rownumber' || key === 'totalitems' || key === 'percentage') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
              } else {
                aVal = (aVal || '').toLowerCase();
                bVal = (bVal || '').toLowerCase();
              }
              
              if (aVal < bVal) return direction === 'asc' ? -1 : 1;
              if (aVal > bVal) return direction === 'asc' ? 1 : -1;
              return 0;
            });
            
            rows.forEach(row => tbody.appendChild(row));
          }
          
          function filterTable(boxCode) {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.forEach(row => {
              const code = row.getAttribute('data-storagecode');
              if (!boxCode || code === boxCode) {
                row.style.display = '';
              } else {
                row.style.display = 'none';
              }
            });
          }
        }
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initTable);
        } else {
          initTable();
        }
      `}
    }),
    
    React.createElement('div', { 
      key: 'content', 
      style: styles ? styles.container : { padding: '20px', fontFamily: 'Arial, sans-serif' } 
    }, [
      React.createElement('div', { 
        key: 'header',
        style: styles ? styles.header : { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } 
      }, [
        React.createElement('h1', { key: 'title', style: { margin: 0 } }, 'Storage Box Usage Report'),
        React.createElement('div', { 
          key: 'datetime',
          style: { textAlign: 'right', fontSize: '14px', color: '#666' } 
        }, currentDateTime)
      ]),

      React.createElement('div', { key: 'summary', style: { marginBottom: '30px' } }, [
        React.createElement('h2', { key: 'subtitle', style: styles ? styles.subtitle : {} }, 'Summary Statistics'),
        React.createElement('div', { 
          key: 'summary-cards',
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' } 
        }, [
          React.createElement('div', {
            key: 'card-total',
            style: styles ? {...styles.statCard, ...styles.cardTotal} : { 
              padding: '15px', 
              backgroundColor: '#4ECDC4', 
              color: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }, [
            React.createElement('div', { 
              key: 'num', 
              style: styles ? styles.statNumber : { fontSize: '32px', fontWeight: 'bold' } 
            }, totalItems),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Total Items')
          ]),
          React.createElement('div', {
            key: 'card-boxes',
            style: styles ? {...styles.statCard, ...styles.cardSuccess} : { 
              padding: '15px', 
              backgroundColor: '#52B788', 
              color: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }, [
            React.createElement('div', { 
              key: 'num', 
              style: styles ? styles.statNumber : { fontSize: '32px', fontWeight: 'bold' } 
            }, processedData.length),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Boxes with Items')
          ]),
          React.createElement('div', {
            key: 'card-avg',
            style: styles ? {...styles.statCard, ...styles.cardInfo} : { 
              padding: '15px', 
              backgroundColor: '#45B7D1', 
              color: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }, [
            React.createElement('div', { 
              key: 'num', 
              style: styles ? styles.statNumber : { fontSize: '32px', fontWeight: 'bold' } 
            }, (totalItems / processedData.length).toFixed(1)),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Avg Items per Box')
          ])
        ])
      ]),

      React.createElement('div', { key: 'chart', style: { marginBottom: '30px' } }, [
        React.createElement('h2', { 
          key: 'chart-title',
          style: styles ? styles.subtitle : {}
        }, 'Item Distribution by Box'),
        createPieChart(),
        React.createElement('div', {
          key: 'legend',
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '8px',
            marginTop: '20px',
            maxHeight: '300px',
            overflowY: 'auto'
          }
        }, processedData.map((box, idx) => 
          React.createElement('div', {
            key: idx,
            style: { display: 'flex', alignItems: 'center', fontSize: '12px' }
          }, [
            React.createElement('div', {
              key: 'color',
              style: {
                width: '16px',
                height: '16px',
                backgroundColor: COLORS[idx],
                marginRight: '6px',
                borderRadius: '3px',
                flexShrink: 0
              }
            }),
            React.createElement('span', { key: 'text' }, `${box.storageName} (${box.totalItems})`)
          ])
        ))
      ]),

      React.createElement('div', { key: 'table-section', style: { marginBottom: '20px' } }, [
        React.createElement('h2', { 
          key: 'table-title',
          style: styles ? styles.subtitle : {}
        }, 'Detailed Box Inventory'),
        React.createElement('div', { key: 'filter', style: { marginBottom: '15px' } }, 
          React.createElement('div', { 
            dangerouslySetInnerHTML: { 
              __html: `<label for='filter-select'>Filter by:</label>
    <select id='filter-select' style='padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px; margin-left: 10px;'>
        <option value=''>All</option>${processedData.map(box => 
          `<option value='${box.storageCode}'>${box.storageName} (${box.totalItems})</option>`
        ).join('')}
    </select>`
            }
          })
        ),

        React.createElement('div', { key: 'table-wrapper', style: { overflowX: 'auto' } },
          React.createElement('table', {
            id: 'sortableTable',
            style: styles ? styles.table : { 
              width: '100%', 
              borderCollapse: 'collapse',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }, [
            React.createElement('thead', { key: 'thead' },
              React.createElement('tr', { 
                style: styles ? styles.tableHeader : { backgroundColor: '#4ECDC4', color: 'white' } 
              }, [
                React.createElement('th', {
                  key: 'th-num',
                  'data-sort': 'rownumber',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'center' }
                }, '#'),
                React.createElement('th', {
                  key: 'th-location',
                  'data-sort': 'locationname',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left' }
                }, 'Location Name'),
                React.createElement('th', {
                  key: 'th-boxname',
                  'data-sort': 'storagename',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left' }
                }, 'Box Name'),
                React.createElement('th', {
                  key: 'th-items',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left' }
                }, 'Storage Items Name'),
                React.createElement('th', {
                  key: 'th-total',
                  'data-sort': 'totalitems',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'center' }
                }, 'Total Number of Item'),
                React.createElement('th', {
                  key: 'th-percent',
                  'data-sort': 'percentage',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'center' }
                }, 'Percentage')
              ])
            ),
            React.createElement('tbody', { key: 'tbody' },
              processedData.map((box, idx) => 
                React.createElement('tr', {
                  key: box.storageCode,
                  'data-storagecode': box.storageCode,
                  'data-rownumber': box.rowNumber,
                  'data-locationname': box.locationName,
                  'data-storagename': box.storageName,
                  'data-totalitems': box.totalItems,
                  'data-percentage': box.percentage,
                  style: styles ? styles.td : { 
                    backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white',
                    borderBottom: '1px solid #ddd'
                  }
                }, [
                  React.createElement('td', { 
                    key: 'num', 
                    style: { 
                      padding: '12px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#666'
                    } 
                  }, box.rowNumber),
                  React.createElement('td', { 
                    key: 'location', 
                    style: { padding: '12px' } 
                  }, box.locationName),
                  React.createElement('td', { 
                    key: 'name', 
                    style: { 
                      padding: '12px',
                      borderLeft: `4px solid ${COLORS[idx]}`,
                      fontWeight: '500'
                    } 
                  }, box.storageName),
                  React.createElement('td', { 
                    key: 'items', 
                    style: { padding: '12px', fontSize: '12px', whiteSpace: 'pre-line' } 
                  }, box.storageItemsName || React.createElement('em', { style: { color: '#999' } }, 'No items')),
                  React.createElement('td', { 
                    key: 'total', 
                    style: { 
                      padding: '12px', 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: COLORS[idx]
                    } 
                  }, box.totalItems),
                  React.createElement('td', { 
                    key: 'percent', 
                    style: { 
                      padding: '12px', 
                      textAlign: 'center',
                      fontWeight: '500'
                    } 
                  }, `${box.percentage}%`)
                ])
              )
            )
          ])
        )
      ])
    ])
  ]);
};

module.exports = StorageBoxUsageReport;