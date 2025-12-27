const React = require('react');

const StorageReport = ({ data }) => {
  // Transform raw data into report structure
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return { locations: [], totalBoxes: 0 };
    }

    // Group by location
    const locationMap = {};
    
    rawData.forEach(box => {
      const locName = box.locationName || 'Unknown Location';
      
      if (!locationMap[locName]) {
        locationMap[locName] = {
          locationName: locName,
          locationCode: box.locationCode,
          locationStatus: box.locationStatus,
          boxes: [],
          totalBoxes: 0
        };
      }
      
      locationMap[locName].boxes.push({
        storageCode: box.storageCode,
        storageName: box.storageName,
        storageStatus: box.storageStatus,
        barcode: box.barcode,
        tags: box.tags || []
      });
      
      locationMap[locName].totalBoxes++;
    });

    // Convert to array and sort by box count
    const locations = Object.values(locationMap).sort((a, b) => 
      b.totalBoxes - a.totalBoxes
    );

    return {
      locations,
      totalBoxes: rawData.length,
      totalLocations: locations.length
    };
  };

  const reportData = transformData(data);

  return React.createElement('div', { style: styles.container },
    // Header
    React.createElement('h1', { style: styles.header }, 'Storage Box Usage Report'),
    React.createElement('p', { style: styles.subtitle }, 
      `Analysis of ${reportData.totalBoxes} boxes across ${reportData.totalLocations} locations`
    ),

    // Summary Cards
    React.createElement('div', { 
      style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }
    },
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardInfo } },
        React.createElement('div', { style: styles.statNumber }, reportData.totalBoxes),
        React.createElement('div', { style: styles.statLabel }, 'Total Boxes')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardSuccess } },
        React.createElement('div', { style: styles.statNumber }, reportData.totalLocations),
        React.createElement('div', { style: styles.statLabel }, 'Locations')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardWarning } },
        React.createElement('div', { style: styles.statNumber }, 
          reportData.totalLocations > 0 
            ? (reportData.totalBoxes / reportData.totalLocations).toFixed(1)
            : '0'
        ),
        React.createElement('div', { style: styles.statLabel }, 'Avg Boxes/Location')
      )
    ),

    // Location Details
    React.createElement('h2', { style: { ...styles.header, fontSize: '1.5rem', marginTop: '30px' } }, 
      'Boxes by Location'
    ),

    ...reportData.locations.map(location =>
      React.createElement('div', { 
        key: location.locationCode,
        style: { marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }
      },
        React.createElement('div', { 
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }
        },
          React.createElement('h3', { style: { margin: 0, fontSize: '1.3rem', textTransform: 'capitalize' } }, 
            location.locationName
          ),
          React.createElement('div', { 
            style: { 
              padding: '5px 15px', 
              backgroundColor: location.locationStatus === 'Full' ? '#dc3545' : '#28a745',
              color: 'white',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }
          }, location.locationStatus)
        ),

        React.createElement('div', { style: { ...styles.statCard, ...styles.cardTotal, marginBottom: '15px' } },
          React.createElement('div', { style: styles.statNumber }, location.totalBoxes),
          React.createElement('div', { style: styles.statLabel }, 'Boxes in this location')
        ),

        React.createElement('table', { style: styles.table },
          React.createElement('thead', { style: styles.tableHeader },
            React.createElement('tr', null,
              React.createElement('th', { style: styles.th }, '#'),
              React.createElement('th', { style: styles.th }, 'Box Name'),
              React.createElement('th', { style: styles.th }, 'Status'),
              React.createElement('th', { style: styles.th }, 'Barcode'),
              React.createElement('th', { style: styles.th }, 'Tags')
            )
          ),
          React.createElement('tbody', null,
            ...location.boxes.map((box, index) =>
              React.createElement('tr', { key: box.storageCode },
                React.createElement('td', { style: styles.td }, index + 1),
                React.createElement('td', { style: styles.td }, box.storageName),
                React.createElement('td', { style: styles.td }, box.storageStatus),
                React.createElement('td', { style: styles.td }, box.barcode || 'N/A'),
                React.createElement('td', { style: styles.td }, 
                  box.tags.length > 0 ? box.tags.join(', ') : 'No tags'
                )
              )
            )
          )
        )
      )
    )
  );
};

module.exports = StorageReport;