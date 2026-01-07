const React = require('react');

const HousekeeperStorageReport = ({ data }) => {
  const [filterValue, setFilterValue] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Transform raw data into report format
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData.map((item, index) => {
      // Parse storage items and count
      let storageItems = item.storageDesc || '';
      let totalItems = 0;

      if (storageItems) {
        const items = storageItems.split(/,|，/).map(i => i.trim());
        const processedItems = items.map(itemText => {
          // Check for multiplier patterns: "N x item" or "item x N"
          const match = itemText.match(/(\d+)\s*x\s*(.+)|(.+)\s*x\s*(\d+)/i);
          if (match) {
            const count = parseInt(match[1] || match[4]);
            const itemName = (match[2] || match[3]).trim();
            totalItems += count;
            return `* ${itemText}`;
          } else {
            totalItems += 1;
            return `* ${itemText}`;
          }
        });
        storageItems = processedItems.join('\n');
      }

      // Parse box status to percentage
      let statusPercent = 0;
      const status = (item.storageStatus || '').toLowerCase();
      
      if (status.includes('25% occupied')) {
        statusPercent = 25;
      } else if (status.includes('50% occupied')) {
        statusPercent = 50;
      } else if (status.includes('75% occupied')) {
        statusPercent = 75;
      }else if (status.includes('fully') || status.includes('full') || status.includes('100%')) {
        statusPercent = 100;
      } else if (status.includes('empty') || status.includes('0%')) {
        statusPercent = 0;
      }  else {
        // Try to extract numeric percentage
        const percentMatch = status.match(/(\d+)%/);
        if (percentMatch) {
          statusPercent = parseInt(percentMatch[1]);
        }
      }

      return {
        number: index + 1,
        totalItems,
        storageItems,
        locationName: item.locationName || '',
        boxName: item.storageName || '',
        barcode: item.barcode || '',
        statusPercent,
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : ''
      };
    });
  };

  const reportData = transformData(data);

  // Get unique tags for filter
  const allTags = React.useMemo(() => {
    const tagSet = new Set();
    reportData.forEach(row => {
      if (row.tags) {
        row.tags.split(',').forEach(tag => tagSet.add(tag.trim()));
      }
    });
    return Array.from(tagSet).sort();
  }, [reportData]);

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!filterValue) return reportData;
    return reportData.filter(row => 
      row.tags.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [reportData, filterValue]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = reportData.length;
    const empty = reportData.filter(r => r.statusPercent === 0).length;
    const full = reportData.filter(r => r.statusPercent === 100).length;
    const partial = total - empty - full;
    const totalItemCount = reportData.reduce((sum, r) => sum + r.totalItems, 0);

    return { total, empty, full, partial, totalItemCount };
  }, [reportData]);

  const getBarStyle = (percent) => {
    if (percent === 100) return styles.bar100;
    if (percent >= 75) return styles.bar75;
    if (percent >= 50) return styles.bar50;
    if (percent >= 25) return styles.bar25;
    return styles.bar0;
  };

  const currentDate = new Date().toLocaleString();

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={styles.header}>Housekeeper Bee Storage Report</h1>
          <p style={styles.subtitle}>Storage Box Usage Analysis</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>
          {currentDate}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ ...styles.statCard, ...styles.cardTotal }}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Boxes</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardSuccess }}>
          <div style={styles.statNumber}>{stats.totalItemCount}</div>
          <div style={styles.statLabel}>Total Items</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardDanger }}>
          <div style={styles.statNumber}>{stats.full}</div>
          <div style={styles.statLabel}>Full Boxes</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardWarning }}>
          <div style={styles.statNumber}>{stats.partial}</div>
          <div style={styles.statLabel}>Partial Boxes</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardInfo }}>
          <div style={styles.statNumber}>{stats.empty}</div>
          <div style={styles.statLabel}>Empty Boxes</div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="filter-select" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Filter by:</label>
        <select 
          id="filter-select"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <table id="sortableTable" style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th} onClick={() => handleSort('number')}># {sortConfig.key === 'number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th style={styles.th} onClick={() => handleSort('totalItems')}>Total Items {sortConfig.key === 'totalItems' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th style={styles.th} onClick={() => handleSort('storageItems')}>Storage Items {sortConfig.key === 'storageItems' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th style={styles.th} onClick={() => handleSort('locationName')}>Location {sortConfig.key === 'locationName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th style={styles.th} onClick={() => handleSort('boxName')}>Box Name {sortConfig.key === 'boxName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th style={styles.th} onClick={() => handleSort('barcode')}>Barcode {sortConfig.key === 'barcode' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th style={styles.th} onClick={() => handleSort('statusPercent')}>Status {sortConfig.key === 'statusPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx}>
              <td style={styles.td}>{row.number}</td>
              <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{row.totalItems}</td>
              <td style={{ ...styles.td, whiteSpace: 'pre-line', fontSize: '0.9rem', minWidth: '200px' }}>{row.storageItems}</td>
              <td style={styles.td}>{row.locationName}</td>
              <td style={styles.td}>{row.boxName}</td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.9rem', textAlign: 'center' }}>
                {row.barcode ? (
                  <>
                    <img
                      alt=""
                      src={`[!MY_API_SRV]/api/barcode/ean13?data=${row.barcode}`}
                    />
                    <br />
                    {row.barcode}
                  </>
                ) : (
                  <span>No Barcode</span>
                )}
              </td>
              <td style={{ ...styles.td, minWidth: '80px', textAlign: 'center' }}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.bar, ...getBarStyle(row.statusPercent), width: `${row.statusPercent}%` }}>
                    {row.statusPercent}%
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No data available
        </div>
      )}
    </div>
  );
};

module.exports = HousekeeperStorageReport;