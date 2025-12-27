const React = require('react');

const StorageTagsChart = ({ data }) => {
  // Transform raw data into tag-based chart data
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return { tags: [], maxCount: 0, totalBoxes: 0, totalTags: 0, untaggedBoxes: 0 };
    }

    // Count boxes by tag
    const tagMap = {};
    let untaggedCount = 0;
    
    rawData.forEach(box => {
      if (!box.tags || box.tags.length === 0) {
        untaggedCount++;
      } else {
        box.tags.forEach(tag => {
          const tagName = tag.toLowerCase().trim();
          if (!tagMap[tagName]) {
            tagMap[tagName] = {
              tagName: tagName,
              count: 0,
              boxes: []
            };
          }
          tagMap[tagName].count++;
          tagMap[tagName].boxes.push(box.storageName);
        });
      }
    });

    // Convert to array and sort by count
    const tags = Object.values(tagMap).sort((a, b) => b.count - a.count);
    const maxCount = tags.length > 0 ? Math.max(...tags.map(t => t.count)) : 0;

    return {
      tags,
      maxCount,
      totalBoxes: rawData.length,
      totalTags: tags.length,
      untaggedBoxes: untaggedCount
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
    React.createElement('h1', { style: styles.header }, 'Storage Box Usage by Tags'),
    React.createElement('p', { style: styles.subtitle }, 
      `Analysis of ${chartData.totalBoxes} boxes with ${chartData.totalTags} unique tags`
    ),

    // Summary Cards
    React.createElement('div', { 
      style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }
    },
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardInfo } },
        React.createElement('div', { style: styles.statNumber }, chartData.totalBoxes),
        React.createElement('div', { style: styles.statLabel }, 'Total Boxes')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardSuccess } },
        React.createElement('div', { style: styles.statNumber }, chartData.totalTags),
        React.createElement('div', { style: styles.statLabel }, 'Unique Tags')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardWarning } },
        React.createElement('div', { style: styles.statNumber }, chartData.maxCount),
        React.createElement('div', { style: styles.statLabel }, 'Most Used Tag')
      ),
      chartData.untaggedBoxes > 0 
        ? React.createElement('div', { style: { ...styles.statCard, ...styles.cardDanger } },
            React.createElement('div', { style: styles.statNumber }, chartData.untaggedBoxes),
            React.createElement('div', { style: styles.statLabel }, 'Untagged Boxes')
          )
        : null
    ),

    // Bar Chart
    React.createElement('div', { style: { marginTop: '30px' } },
      React.createElement('h2', { style: { ...styles.header, fontSize: '1.5rem', marginBottom: '20px' } }, 
        'Box Count by Tag'
      ),

      chartData.tags.length === 0
        ? React.createElement('div', { 
            style: { 
              padding: '40px', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              color: '#6c757d'
            }
          },
          React.createElement('p', { style: { fontSize: '1.2rem' } }, 'No tags found in storage boxes')
        )
        : React.createElement('div', { style: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' } },
            ...chartData.tags.map(tag => 
              React.createElement('div', { 
                key: tag.tagName,
                style: { marginBottom: '20px' }
              },
                // Tag name and count
                React.createElement('div', { 
                  style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }
                },
                  React.createElement('span', { 
                    style: { 
                      textTransform: 'capitalize',
                      backgroundColor: '#e9ecef',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '0.95rem'
                    } 
                  }, 
                    `#${tag.tagName}`
                  ),
                  React.createElement('span', { style: { fontWeight: 'bold' } }, 
                    `${tag.count} ${tag.count === 1 ? 'box' : 'boxes'}`
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
                      width: `${getBarWidth(tag.count)}%`,
                      height: '100%',
                      backgroundColor: getBarColor(tag.count),
                      transition: 'width 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '10px',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  },
                    getBarWidth(tag.count) > 15 
                      ? React.createElement('span', null, `${getBarWidth(tag.count).toFixed(0)}%`)
                      : null
                  )
                ),

                // Box names
                React.createElement('div', { 
                  style: { 
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }
                },
                  tag.boxes.length <= 3
                    ? `Boxes: ${tag.boxes.join(', ')}`
                    : `Boxes: ${tag.boxes.slice(0, 3).join(', ')} +${tag.boxes.length - 3} more`
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
          React.createElement('span', { style: { fontSize: '0.9rem' } }, '100% (Most Used)')
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

module.exports = StorageTagsChart;