const React = require('react');

const StorageBox3DBarChartReport = ({ data }) => {
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

  // Process data
  const processedData = data.map((box, index) => {
    const itemCount = parseItemCount(box.storageDesc);
    return {
      rowNumber: index + 1,
      storageCode: box.storageCode,
      locationName: box.locationName || 'Unknown',
      storageName: box.storageName,
      storeItems: formatDescription(box.storageDesc),
      originalDesc: box.storageDesc,
      totalItems: itemCount
    };
  });

  // Group by location for chart
  const locationGroups = {};
  processedData.forEach(box => {
    if (!locationGroups[box.locationName]) {
      locationGroups[box.locationName] = {
        location: box.locationName,
        boxCount: 0,
        totalItems: 0
      };
    }
    locationGroups[box.locationName].boxCount += 1;
    locationGroups[box.locationName].totalItems += box.totalItems;
  });

  const chartData = Object.values(locationGroups).sort((a, b) => b.totalItems - a.totalItems);
  const maxItems = Math.max(...chartData.map(d => d.totalItems), 1);

  // Calculate statistics
  const totalBoxes = processedData.length;
  const totalItems = processedData.reduce((sum, box) => sum + box.totalItems, 0);
  const uniqueLocations = chartData.length;

  // Current date/time
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate color based on item count
  const getBarColor = (items) => {
    const ratio = items / maxItems;
    if (ratio > 0.7) return '#52B788';
    if (ratio > 0.4) return '#F7DC6F';
    return '#FF6B6B';
  };

  // Get unique locations for filter
  const uniqueLocationList = [...new Set(processedData.map(box => box.locationName))].sort();

  // Create 3D Bar Chart
  const create3DBarChart = () => {
    const barWidth = 80;
    const barSpacing = 30;
    const maxBarHeight = 280;
    const minBarHeight = 40;

    return React.createElement('div', {
      style: {
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '20px 0',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }
    }, 
      React.createElement('div', {
        style: {
          perspective: '1200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          minHeight: '450px',
          padding: '20px',
          minWidth: `${chartData.length * (barWidth + barSpacing) + 40}px`
        }
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'flex-end',
            gap: `${barSpacing}px`,
            transform: 'rotateX(8deg) rotateY(-3deg)',
            transformStyle: 'preserve-3d'
          }
        },
          chartData.map((item, idx) => {
            const barHeight = Math.max((item.totalItems / maxItems) * maxBarHeight, minBarHeight);
            const color = getBarColor(item.totalItems);
            
            return React.createElement('div', {
              key: idx,
              style: {
                position: 'relative',
                transformStyle: 'preserve-3d',
                marginBottom: '60px'
              }
            }, [
              // Bar container
              React.createElement('div', {
                key: 'bar',
                style: {
                  width: `${barWidth}px`,
                  height: `${barHeight}px`,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.3s ease'
                }
              }, [
                // Front face
                React.createElement('div', {
                  key: 'front',
                  style: {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    borderRadius: '4px 4px 0 0',
                    border: 'none'
                  }
                }, item.totalItems),
                // Top face
                React.createElement('div', {
                  key: 'top',
                  style: {
                    position: 'absolute',
                    width: '100%',
                    height: '25px',
                    backgroundColor: color,
                    filter: 'brightness(1.3)',
                    transform: 'rotateX(90deg) translateZ(12.5px)',
                    transformOrigin: 'top',
                    top: 0,
                    borderRadius: '4px 4px 0 0',
                    border: 'none'
                  }
                }),
                // Right face
                React.createElement('div', {
                  key: 'right',
                  style: {
                    position: 'absolute',
                    width: '25px',
                    height: '100%',
                    backgroundColor: color,
                    filter: 'brightness(0.7)',
                    transform: 'rotateY(90deg) translateZ(' + (barWidth - 12.5) + 'px)',
                    transformOrigin: 'right',
                    right: 0,
                    border: 'none'
                  }
                })
              ]),
              // Label below bar
              React.createElement('div', {
                key: 'label',
                style: {
                  position: 'absolute',
                  top: `${barHeight + 10}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: `${barWidth + 20}px`,
                  textAlign: 'center'
                }
              }, [
                React.createElement('div', { 
                  key: 'location',
                  style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#333',
                    lineHeight: '1.3',
                    marginBottom: '4px',
                    wordWrap: 'break-word'
                  }
                }, item.location),
                React.createElement('div', { 
                  key: 'count',
                  style: { 
                    fontSize: '11px', 
                    color: '#666',
                    fontWeight: '500'
                  }
                }, `(${item.boxCount} boxes)`)
              ])
            ]);
          })
        )
      )
    );
  };

  return React.createElement('div', null, [
    React.createElement('script', { 
      key: 'script',
      dangerouslySetInnerHTML: { __html: `
        function initTable() {
          const table = document.getElementById('sortableTable');
          if (!table) return;
          
          let sortConfig = { key: null, direction: 'asc' };
          let filterLocation = '';
          
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
              filterLocation = e.target.value;
              filterTable(filterLocation);
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
              
              if (key === 'rownumber' || key === 'totalitems') {
                aVal = parseInt(aVal) || 0;
                bVal = parseInt(bVal) || 0;
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
          
          function filterTable(location) {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.forEach(row => {
              const rowLocation = row.getAttribute('data-locationname');
              if (!location || rowLocation === location) {
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
        React.createElement('h1', { key: 'title', style: { margin: 0 } }, 'Storage Box Usage by Location'),
        React.createElement('div', { 
          key: 'datetime',
          style: { textAlign: 'right', fontSize: '14px', color: '#666' } 
        }, currentDateTime)
      ]),

      React.createElement('div', { key: 'summary', style: { marginBottom: '30px' } }, [
        React.createElement('h2', { 
          key: 'subtitle', 
          style: styles ? styles.subtitle : { marginBottom: '15px' } 
        }, 'Summary Statistics'),
        React.createElement('div', { 
          key: 'summary-cards',
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' } 
        }, [
          React.createElement('div', {
            key: 'card-locations',
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
            }, uniqueLocations),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Unique Locations')
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
            }, totalBoxes),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Total Boxes')
          ]),
          React.createElement('div', {
            key: 'card-items',
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
            }, totalItems),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Total Items')
          ])
        ])
      ]),

      React.createElement('div', { key: 'chart', style: { marginBottom: '30px' } }, [
        React.createElement('h2', { 
          key: 'chart-title',
          style: styles ? styles.subtitle : { marginBottom: '15px' }
        }, '3D Bar Chart - Items by Location'),
        create3DBarChart()
      ]),

      React.createElement('div', { key: 'table-section', style: { marginBottom: '20px' } }, [
        React.createElement('h2', { 
          key: 'table-title',
          style: styles ? styles.subtitle : { marginBottom: '15px' }
        }, 'Storage Box Details'),
        React.createElement('div', { key: 'filter', style: { marginBottom: '15px' } }, 
          React.createElement('div', { 
            dangerouslySetInnerHTML: { 
              __html: `<label for='filter-select'>Filter by:</label>
    <select id='filter-select' style='padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px; margin-left: 10px;'>
        <option value=''>All</option>${uniqueLocationList.map(location => 
          `<option value='${location}'>${location}</option>`
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
                  style: styles ? styles.th : { padding: '12px', textAlign: 'center', width: '50px' }
                }, '#'),
                React.createElement('th', {
                  key: 'th-location',
                  'data-sort': 'locationname',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left', minWidth: '150px' }
                }, 'Location Name'),
                React.createElement('th', {
                  key: 'th-boxname',
                  'data-sort': 'storagename',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left', minWidth: '150px' }
                }, 'Box Name'),
                React.createElement('th', {
                  key: 'th-items',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left', width: '300px' }
                }, 'Store Items'),
                React.createElement('th', {
                  key: 'th-total',
                  'data-sort': 'totalitems',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'center', width: '120px' }
                }, 'Total Number of Items')
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
                      fontWeight: '500'
                    } 
                  }, box.storageName),
                  React.createElement('td', { 
                    key: 'items', 
                    style: { 
                      padding: '12px', 
                      fontSize: '12px', 
                      whiteSpace: 'pre-line',
                      width: '300px',
                      maxWidth: '300px',
                      wordWrap: 'break-word',
                      overflow: 'hidden'
                    } 
                  }, box.storeItems || React.createElement('em', { style: { color: '#999' } }, 'No items')),
                  React.createElement('td', { 
                    key: 'total', 
                    style: { 
                      padding: '12px', 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: box.totalItems > 10 ? '#52B788' : box.totalItems > 5 ? '#F7DC6F' : '#FF6B6B'
                    } 
                  }, box.totalItems)
                ])
              )
            )
          ])
        )
      ])
    ])
  ]);
};

module.exports = StorageBox3DBarChartReport;