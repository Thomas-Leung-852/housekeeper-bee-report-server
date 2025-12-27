const StorageStackedChart = ({ data }) => {
  // Transform raw data into location-based tag distribution
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return { locations: [], allTags: [], totalBoxes: 0 };
    }

    // First, collect all unique tags across all boxes
    const allTagsSet = new Set();
    rawData.forEach(box => {
      if (box.tags && box.tags.length > 0) {
        box.tags.forEach(tag => allTagsSet.add(tag.toLowerCase().trim()));
      }
    });
    const allTags = Array.from(allTagsSet).sort();

    // Group by location and count tags
    const locationMap = {};
    
    rawData.forEach(box => {
      const locName = box.locationName || 'Unknown Location';
      
      if (!locationMap[locName]) {
        locationMap[locName] = {
          locationName: locName,
          boxCount: 0,
          tagCounts: {},
          totalTags: 0
        };
        // Initialize all tags with 0
        allTags.forEach(tag => {
          locationMap[locName].tagCounts[tag] = 0;
        });
      }
      
      locationMap[locName].boxCount++;
      
      // Count tags for this box
      if (box.tags && box.tags.length > 0) {
        box.tags.forEach(tag => {
          const tagName = tag.toLowerCase().trim();
          locationMap[locName].tagCounts[tagName]++;
          locationMap[locName].totalTags++;
        });
      }
    });

    // Convert to array and calculate percentages
    const locations = Object.values(locationMap).map(loc => {
      const tagPercentages = {};
      allTags.forEach(tag => {
        tagPercentages[tag] = loc.totalTags > 0 
          ? (loc.tagCounts[tag] / loc.totalTags) * 100 
          : 0;
      });
      return {
        ...loc,
        tagPercentages
      };
    }).sort((a, b) => b.boxCount - a.boxCount);

    return {
      locations,
      allTags,
      totalBoxes: rawData.length
    };
  };

  const chartData = transformData(data);

  // Color palette for tags
  const tagColors = [
    '#dc3545', '#fd7e14', '#ffc107', '#28a745', '#17a2b8',
    '#6f42c1', '#e83e8c', '#20c997', '#6610f2', '#007bff',
    '#6c757d', '#343a40', '#f8f9fa', '#d63384', '#fd7e14'
  ];

  const getTagColor = (tag, index) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Tag Distribution by Location</h1>
      <p style={styles.subtitle}>
        Percentage breakdown of {chartData.allTags.length} tags across {chartData.locations.length} locations
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ ...styles.statCard, ...styles.cardInfo }}>
          <div style={styles.statNumber}>{chartData.totalBoxes}</div>
          <div style={styles.statLabel}>Total Boxes</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardSuccess }}>
          <div style={styles.statNumber}>{chartData.locations.length}</div>
          <div style={styles.statLabel}>Locations</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardWarning }}>
          <div style={styles.statNumber}>{chartData.allTags.length}</div>
          <div style={styles.statLabel}>Unique Tags</div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ ...styles.header, fontSize: '1.5rem', marginBottom: '20px' }}>
          Tag Percentage by Location (Stacked)
        </h2>

        {chartData.locations.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#6c757d' }}>
            <p style={{ fontSize: '1.2rem' }}>No location data found</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            {chartData.locations.map(location => (
              <div key={location.locationName} style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                  <span style={{ textTransform: 'capitalize' }}>{location.locationName}</span>
                  <span style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                    {location.boxCount} {location.boxCount === 1 ? 'box' : 'boxes'}, {location.totalTags} tags
                  </span>
                </div>

                <div style={{ width: '100%', height: '50px', backgroundColor: '#e9ecef', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: '10px' }}>
                  {chartData.allTags.map((tag, tagIndex) => {
                    const percentage = location.tagPercentages[tag];
                    if (percentage === 0) return null;
                    
                    return (
                      <div 
                        key={tag}
                        style={{ 
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: getTagColor(tag, tagIndex),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        title={`${tag}: ${percentage.toFixed(1)}%`}
                      >
                        {percentage > 8 ? `${percentage.toFixed(0)}%` : null}
                      </div>
                    );
                  }).filter(Boolean)}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                  {chartData.allTags.map((tag, tagIndex) => {
                    const percentage = location.tagPercentages[tag];
                    const count = location.tagCounts[tag];
                    if (count === 0) return null;
                    
                    return (
                      <div 
                        key={tag}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.85rem',
                          backgroundColor: 'white',
                          padding: '4px 10px',
                          borderRadius: '15px',
                          border: `2px solid ${getTagColor(tag, tagIndex)}`
                        }}
                      >
                        <div style={{ width: '12px', height: '12px', backgroundColor: getTagColor(tag, tagIndex), borderRadius: '50%' }} />
                        <span style={{ fontWeight: '500' }}>#{tag}</span>
                        <span style={{ color: '#6c757d' }}>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Tag Color Legend</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {chartData.allTags.map((tag, index) => (
            <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '20px', backgroundColor: getTagColor(tag, index), borderRadius: '3px' }} />
              <span style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

module.exports = StorageStackedChart;