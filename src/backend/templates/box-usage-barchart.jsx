const React = require('react');

const StorageBarChart = ({ data }) => {
  // Transform raw data into chart data structure
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return { locations: [], maxCount: 0, totalBoxes: 0 };
    }

    // Group by location and count boxes
    const locationMap = {};
    
    rawData.forEach(box => {
      const locName = box.locationName || 'Unknown Location';
      
      if (!locationMap[locName]) {
        locationMap[locName] = {
          locationName: locName,
          count: 0,
          status: box.locationStatus
        };
      }
      
      locationMap[locName].count++;
    });

    // Convert to array and sort by count
    const locations = Object.values(locationMap).sort((a, b) => 
      b.count - a.count
    );

    const maxCount = locations.length > 0 ? Math.max(...locations.map(l => l.count)) : 0;

    return {
      locations,
      maxCount,
      totalBoxes: rawData.length
    };
  };

  const chartData = transformData(data);

  // Calculate bar width percentage
  const getBarWidth = (count) => {
    if (chartData.maxCount === 0) return 0;
    return (count / chartData.maxCount) * 100;
  };

  // Get color based on count
  const getBarColor = (count) => {
    const percentage = (count / chartData.maxCount) * 100;
    if (percentage === 100) return '#dc3545'; // Red for highest
    if (percentage >= 75) return '#fd7e14'; // Orange
    if (percentage >= 50) return '#ffc107'; // Yellow
    if (percentage >= 25) return '#28a745'; // Green
    return '#17a2b8'; // Blue for lowest
  };

  return React.createElement('div', { style: styles.container },
    // Header
    React.createElement('h1', { style: styles.header }, 'Storage Box Usage by Location'),
    React.createElement('p', { style: styles.subtitle }, 
      `Total ${chartData.totalBoxes} boxes across ${chartData.locations.length} locations`
    ),

    // Summary Card
    React.createElement('div', { 
      style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }
    },
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardInfo } },
        React.createElement('div', { style: styles.statNumber }, chartData.totalBoxes),
        React.createElement('div', { style: styles.statLabel }, 'Total Boxes')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardSuccess } },
        React.createElement('div', { style: styles.statNumber }, chartData.locations.length),
        React.createElement('div', { style: styles.statLabel }, 'Locations')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardWarning } },
        React.createElement('div', { style: styles.statNumber }, chartData.maxCount),
        React.createElement('div', { style: styles.statLabel }, 'Max Boxes in One Location')
      )
    ),

    // Bar Chart
    React.createElement('div', { style: { marginTop: '30px' } },
      React.createElement('h2', { style: { ...styles.header, fontSize: '1.5rem', marginBottom: '20px' } }, 
        'Box Count by Location'
      ),

      React.createElement('div', { style: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' } },
        ...chartData.locations.map(location => 
          React.createElement('div', { 
            key: location.locationName,
            style: { marginBottom: '20px' }
          },
            // Location name and count
            React.createElement('div', { 
              style: { 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px',
                fontSize: '1rem',
                fontWeight: '500'
              }
            },
              React.createElement('span', { style: { textTransform: 'capitalize' } }, location.locationName),
              React.createElement('span', { style: { fontWeight: 'bold' } }, 
                `${location.count} ${location.count === 1 ? 'box' : 'boxes'}`
              )
            ),

            // Bar
            React.createElement('div', { 
              style: { 
                width: '100%',
                height: '40px',
                backgroundColor: '#e9ecef',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative'
              }
            },
              React.createElement('div', { 
                style: { 
                  width: `${getBarWidth(location.count)}%`,
                  height: '100%',
                  backgroundColor: getBarColor(location.count),
                  transition: 'width 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '10px',
                  color: 'white',
                  fontWeight: 'bold'
                }
              },
                getBarWidth(location.count) > 15 
                  ? React.createElement('span', null, `${getBarWidth(location.count).toFixed(0)}%`)
                  : null
              )
            ),

            // Status badge
            React.createElement('div', { 
              style: { 
                marginTop: '5px',
                fontSize: '0.85rem',
                color: '#6c757d'
              }
            },
              `Status: ${location.status}`
            )
          )
        )
      )
    ),

    // Legend
    React.createElement('div', { style: { marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' } },
      React.createElement('h3', { style: { fontSize: '1rem', marginBottom: '10px' } }, 'Color Legend'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '15px' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('div', { style: { width: '30px', height: '20px', backgroundColor: '#dc3545', borderRadius: '3px' } }),
          React.createElement('span', { style: { fontSize: '0.9rem' } }, '100% (Highest)')
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('div', { style: { width: '30px', height: '20px', backgroundColor: '#fd7e14', borderRadius: '3px' } }),
          React.createElement('span', { style: { fontSize: '0.9rem' } }, '75-99%')
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('div', { style: { width: '30px', height: '20px', backgroundColor: '#ffc107', borderRadius: '3px' } }),
          React.createElement('span', { style: { fontSize: '0.9rem' } }, '50-74%')
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('div', { style: { width: '30px', height: '20px', backgroundColor: '#28a745', borderRadius: '3px' } }),
          React.createElement('span', { style: { fontSize: '0.9rem' } }, '25-49%')
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('div', { style: { width: '30px', height: '20px', backgroundColor: '#17a2b8', borderRadius: '3px' } }),
          React.createElement('span', { style: { fontSize: '0.9rem' } }, '0-24%')
        )
      )
    )
  );
};

module.exports = StorageBarChart;