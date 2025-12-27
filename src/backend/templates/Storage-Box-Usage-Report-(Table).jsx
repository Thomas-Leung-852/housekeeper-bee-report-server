const React = require('react');

const StorageBoxUsageTableReport = ({ data }) => {
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

  // Process data - transform raw data to report structure
  const processedData = data.map((box, index) => {
    const itemCount = parseItemCount(box.storageDesc);
    return {
      rowNumber: index + 1,
      storageCode: box.storageCode,
      locationName: box.locationName || 'N/A',
      storageName: box.storageName || 'N/A',
      barcode: box.barcode || 'N/A',
      numberOfItem: itemCount,
      storageItems: formatDescription(box.storageDesc),
      boxStatus: box.storageStatus || 'N/A'
    };
  });

  // Calculate statistics
  const totalBoxes = processedData.length;
  const totalItems = processedData.reduce((sum, box) => sum + box.numberOfItem, 0);
  const boxesWithItems = processedData.filter(box => box.numberOfItem > 0).length;
  const boxesWithBarcode = processedData.filter(box => box.barcode !== 'N/A' && box.barcode !== '').length;

  // Current date/time
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get unique locations for filter
  const uniqueLocations = [...new Set(data.map(box => box.locationName).filter(Boolean))];

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
              
              if (key === 'rownumber' || key === 'numberofitem') {
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
        React.createElement('h1', { key: 'title', style: { margin: 0 } }, 'Storage Box Usage Report'),
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
            key: 'card-boxes',
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
            }, totalBoxes),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Total Boxes')
          ]),
          React.createElement('div', {
            key: 'card-items',
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
            }, totalItems),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Total Items')
          ]),
          React.createElement('div', {
            key: 'card-witheitems',
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
            }, boxesWithItems),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Boxes with Items')
          ]),
          React.createElement('div', {
            key: 'card-barcode',
            style: styles ? {...styles.statCard, ...styles.cardWarning} : { 
              padding: '15px', 
              backgroundColor: '#F7DC6F', 
              color: '#333', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }, [
            React.createElement('div', { 
              key: 'num', 
              style: styles ? styles.statNumber : { fontSize: '32px', fontWeight: 'bold' } 
            }, boxesWithBarcode),
            React.createElement('div', { 
              key: 'label', 
              style: styles ? styles.statLabel : { fontSize: '14px' } 
            }, 'Boxes with Barcode')
          ])
        ])
      ]),

      React.createElement('div', { key: 'table-section', style: { marginBottom: '20px' } }, [
        React.createElement('h2', { 
          key: 'table-title',
          style: styles ? styles.subtitle : { marginBottom: '15px' }
        }, 'Storage Box Inventory'),
        React.createElement('div', { key: 'filter', style: { marginBottom: '15px' } }, 
          React.createElement('div', { 
            dangerouslySetInnerHTML: { 
              __html: `<label for='filter-select'>Filter by:</label>
    <select id='filter-select' style='padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px; margin-left: 10px;'>
        <option value=''>All</option>${uniqueLocations.map(location => 
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
                  style: styles ? styles.th : { padding: '12px', textAlign: 'center', minWidth: '50px' }
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
                  key: 'th-barcode',
                  'data-sort': 'barcode',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left', minWidth: '120px' }
                }, 'Barcode'),
                React.createElement('th', {
                  key: 'th-numitem',
                  'data-sort': 'numberofitem',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'center', minWidth: '100px' }
                }, 'Number of Item'),
                React.createElement('th', {
                  key: 'th-items',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left', minWidth: '250px' }
                }, 'Storage Items'),
                React.createElement('th', {
                  key: 'th-status',
                  'data-sort': 'boxstatus',
                  style: styles ? styles.th : { padding: '12px', textAlign: 'left', minWidth: '120px' }
                }, 'Box Status')
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
                  'data-barcode': box.barcode,
                  'data-numberofitem': box.numberOfItem,
                  'data-boxstatus': box.boxStatus,
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
                    key: 'barcode', 
                    style: { 
                      padding: '12px',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      color: box.barcode === 'N/A' ? '#999' : '#333'
                    } 
                  }, box.barcode),
                  React.createElement('td', { 
                    key: 'numitem', 
                    style: { 
                      padding: '12px', 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: box.numberOfItem > 0 ? '#52B788' : '#999'
                    } 
                  }, box.numberOfItem),
                  React.createElement('td', { 
                    key: 'items', 
                    style: { 
                      padding: '12px', 
                      fontSize: '12px', 
                      whiteSpace: 'pre-line',
                      maxWidth: '300px'
                    } 
                  }, box.storageItems || React.createElement('em', { style: { color: '#999' } }, 'No items')),
                  React.createElement('td', { 
                    key: 'status', 
                    style: { 
                      padding: '12px',
                      fontSize: '13px'
                    } 
                  }, React.createElement('span', {
                    style: {
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: box.boxStatus.includes('full') ? '#52B788' : 
                                      box.boxStatus.includes('75%') ? '#F7DC6F' :
                                      box.boxStatus.includes('50%') ? '#FFA07A' : '#ddd',
                      color: box.boxStatus.includes('full') || box.boxStatus.includes('75%') ? '#fff' : '#333',
                      fontSize: '11px',
                      fontWeight: '500'
                    }
                  }, box.boxStatus))
                ])
              )
            )
          ])
        )
      ])
    ])
  ]);
};

module.exports = StorageBoxUsageTableReport;