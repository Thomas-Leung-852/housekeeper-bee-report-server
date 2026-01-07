const React = require('react');

const HousekeeperBeeReport = ({ data }) => {
  // Get current date/time
  const now = new Date();
  const dateTimeStr = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Aggregate tags and count occurrences
  const tagFrequency = {};
  const tagToBoxes = {};
  
  data.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => {
        const normalizedTag = tag.trim().toLowerCase();
        if (normalizedTag) {
          tagFrequency[normalizedTag] = (tagFrequency[normalizedTag] || 0) + 1;
          if (!tagToBoxes[normalizedTag]) {
            tagToBoxes[normalizedTag] = [];
          }
          tagToBoxes[normalizedTag].push(item.storageName);
        }
      });
    }
  });

  // Sort tags by frequency
  const sortedTags = Object.entries(tagFrequency)
    .map(([tag, count]) => ({
      tag,
      count,
      boxes: tagToBoxes[tag]
    }))
    .sort((a, b) => b.count - a.count);

  const maxCount = sortedTags.length > 0 ? sortedTags[0].count : 1;
  const totalTags = sortedTags.reduce((sum, item) => sum + item.count, 0);
  const uniqueTags = sortedTags.length;

  // Calculate font sizes for word cloud (16px to 48px range)
  const getTagSize = (count) => {
    const minSize = 16;
    const maxSize = 48;
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  // Generate colors for tags
  const getTagColor = (index) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6'
    ];
    return colors[index % colors.length];
  };

  // State for view mode and filtering
  const [viewMode, setViewMode] = React.useState('cloud'); // 'cloud' or 'bar'
  const [sortConfig, setSortConfig] = React.useState({ key: 'count', direction: 'desc' });
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState(null);

  // Get unique locations for filter
  const uniqueLocations = [...new Set(data.map(item => item.locationName))].sort();

  // Filter tags based on location
  const filteredTags = filterValue ? sortedTags.map(tagItem => {
    const filteredBoxes = tagItem.boxes.filter(boxName => {
      const box = data.find(item => item.storageName === boxName);
      return box && box.locationName === filterValue;
    });
    return {
      ...tagItem,
      count: filteredBoxes.length,
      boxes: filteredBoxes
    };
  }).filter(tagItem => tagItem.count > 0) : sortedTags;

  // Sort filtered tags
  const displayTags = [...filteredTags].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Word Cloud Component
  const WordCloud = () => {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        minHeight: '400px'
      }
    },
      displayTags.map((item, idx) => 
        React.createElement('span', {
          key: item.tag,
          style: {
            fontSize: `${getTagSize(item.count)}px`,
            color: getTagColor(idx),
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: selectedTag === item.tag ? '#e0e7ff' : 'transparent'
          },
          onClick: () => setSelectedTag(selectedTag === item.tag ? null : item.tag),
          onMouseEnter: (e) => e.target.style.transform = 'scale(1.1)',
          onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
          title: `${item.tag}: ${item.count} occurrence(s)`
        }, `${item.tag} (${item.count})`)
      )
    );
  };

  // Horizontal Bar Chart Component
  const BarChart = () => {
    return React.createElement('div', {
      style: {
        padding: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }
    },
      displayTags.map((item, idx) => {
        const barWidth = (item.count / maxCount) * 100;
        return React.createElement('div', {
          key: item.tag,
          style: {
            marginBottom: '16px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: selectedTag === item.tag ? '#e0e7ff' : 'transparent'
          },
          onClick: () => setSelectedTag(selectedTag === item.tag ? null : item.tag)
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: '500'
            }
          },
            React.createElement('span', { style: { color: '#374151' } }, item.tag),
            React.createElement('span', { style: { color: '#6b7280' } }, `${item.count} (${((item.count / totalTags) * 100).toFixed(1)}%)`)
          ),
          React.createElement('div', {
            style: {
              width: '100%',
              height: '24px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }
          },
            React.createElement('div', {
              style: {
                width: `${barWidth}%`,
                height: '100%',
                backgroundColor: getTagColor(idx),
                transition: 'width 0.3s ease'
              }
            })
          )
        );
      })
    );
  };

  // Selected Tag Details
  const SelectedTagDetails = () => {
    if (!selectedTag) return null;
    
    const tagData = displayTags.find(item => item.tag === selectedTag);
    if (!tagData) return null;

    return React.createElement('div', {
      style: {
        marginTop: '24px',
        padding: '20px',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        border: '2px solid #3b82f6'
      }
    },
      React.createElement('h3', {
        style: {
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#1e40af'
        }
      }, `Tag: "${tagData.tag}"`),
      React.createElement('p', {
        style: {
          fontSize: '14px',
          color: '#374151',
          marginBottom: '12px'
        }
      }, `Found in ${tagData.count} storage box(es):`),
      React.createElement('ul', {
        style: {
          listStyle: 'disc',
          paddingLeft: '24px',
          fontSize: '14px',
          color: '#4b5563'
        }
      },
        tagData.boxes.map(boxName => 
          React.createElement('li', { key: boxName, style: { marginBottom: '4px' } }, boxName)
        )
      )
    );
  };

  return React.createElement('div', { style: styles.container },
    // Header with date/time
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }
    },
      React.createElement('h1', { style: styles.header }, 'Category Distribution (Tag Cloud)'),
      React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, dateTimeStr)
    ),

    // Subtitle
    React.createElement('p', {
      style: {
        ...styles.subtitle,
        marginBottom: '24px'
      }
    }, 'An overview of the types of items in your inventory to see what you own the most of'),

    // Summary Stats
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }
    },
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardInfo } },
        React.createElement('div', { style: styles.statNumber }, uniqueTags),
        React.createElement('div', { style: styles.statLabel }, 'Unique Tags')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardTotal } },
        React.createElement('div', { style: styles.statNumber }, totalTags),
        React.createElement('div', { style: styles.statLabel }, 'Total Tag Occurrences')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardSuccess } },
        React.createElement('div', { style: styles.statNumber }, sortedTags.length > 0 ? sortedTags[0].tag : 'N/A'),
        React.createElement('div', { style: styles.statLabel }, 'Most Common Tag')
      ),
      React.createElement('div', { style: { ...styles.statCard, ...styles.cardWarning } },
        React.createElement('div', { style: styles.statNumber }, sortedTags.length > 0 ? sortedTags[0].count : 0),
        React.createElement('div', { style: styles.statLabel }, 'Top Tag Count')
      )
    ),

    // Controls
    React.createElement('div', {
      style: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }
    },
 
    // Visualization
    viewMode === 'cloud' ? React.createElement(WordCloud) : React.createElement(BarChart),

    // Selected Tag Details
    React.createElement(SelectedTagDetails),
     // Location Filter
      React.createElement('div', null,
        React.createElement('label', {
          htmlFor: 'filter-select',
          style: { marginRight: '10px', fontWeight: '500' }
        }, 'Filter by count:'),
        React.createElement('select', {
          id: 'filter-select',
          style: {
            maxWidth: '300px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #d1d5db'
          },
          value: filterValue,
          onChange: (e) => {
            setFilterValue(e.target.value);
            setSelectedTag(null);
          }
        },
          React.createElement('option', { value: '' }, 'All Locations'),
          uniqueLocations.map(loc => 
            React.createElement('option', { key: loc, value: loc }, loc)
          )
        )
      )
    ),

    // Detailed Table
    React.createElement('h2', {
      style: {
        fontSize: '20px',
        fontWeight: '600',
        marginTop: '48px',
        marginBottom: '16px'
      }
    }, 'Tag Details Table'),

    React.createElement('table', {
      id: 'sortableTable',
      style: styles.table
    },
      React.createElement('thead', { style: styles.tableHeader },
        React.createElement('tr', null,
          React.createElement('th', {
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('tag')
          }, `Tag ${sortConfig.key === 'tag' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}`),
          React.createElement('th', {
            style: { ...styles.th, cursor: 'pointer' },
            onClick: () => handleSort('count')
          }, `Count ${sortConfig.key === 'count' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}`),
          React.createElement('th', { style: styles.th }, 'Percentage'),
          React.createElement('th', { style: styles.th }, 'Storage Boxes')
        )
      ),
      React.createElement('tbody', null,
        displayTags.map((item, idx) => 
          React.createElement('tr', {
            key: item.tag,
            style: {
              backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white',
              cursor: 'pointer'
            },
            onClick: () => setSelectedTag(selectedTag === item.tag ? null : item.tag)
          },
            React.createElement('td', {
              style: {
                ...styles.td,
                fontWeight: '600',
                color: getTagColor(idx)
              }
            }, item.tag),
            React.createElement('td', { style: styles.td }, item.count),
            React.createElement('td', { style: styles.td }, 
              `${((item.count / totalTags) * 100).toFixed(1)}%`
            ),
            React.createElement('td', {
              style: { ...styles.td, fontSize: '13px' }
            }, item.boxes.join(', '))
          )
        )
      )
    ),

    // Footer
    React.createElement('div', {
      style: {
        marginTop: '24px',
        fontSize: '14px',
        color: '#6b7280',
        textAlign: 'center'
      }
    }, `Showing ${displayTags.length} tags from ${data.length} storage boxes`)
  );
};

module.exports = HousekeeperBeeReport;