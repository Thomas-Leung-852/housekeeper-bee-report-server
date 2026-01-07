const React = require('react');
const humanNames = require('human-names');

const HousekeeperBeeReport = ({ data }) => {
  const reportData = data || [];
  const now = new Date().toLocaleString();

  // 1. IMPROVED NAME LOADING
  // human-names usually exports names grouped by language or by gender.
  // We'll flatten everything into one giant Set for maximum reliability.
  const getNames = () => {
    try {
      // Try to get the English list or the full list
      const list = humanNames.allEn || humanNames.all || [];
      // If the above fails, manually combine common properties
      const fallback = [
        ...(humanNames.male || []),
        ...(humanNames.female || []),
        ...(humanNames.en ? humanNames.en.male : []),
        ...(humanNames.en ? humanNames.en.female : [])
      ];
      return new Set([...list, ...fallback].map(n => n.toLowerCase()));
    } catch (e) {
      return new Set();
    }
  };

  const nameSet = getNames();

  // 2. DATA TRANSFORMATION
  const processedRows = [];
  const personStats = {};

  reportData.forEach((item) => {
    const tags = item.tags || [];

    // Filter tags to find Individual Names
    const individualTags = tags.filter(tag => {
      const lowerTag = tag.trim().toLowerCase();
      // We check if it's in our name list
      return nameSet.has(lowerTag);
    });

    // If no individual name tags found, skip this record
    if (individualTags.length === 0) return;

    // Parse items & quantities (e.g., "Micro HDMI x 1")
    const desc = item.storageDesc || '';
    const parts = desc.split(/[，,]/);
    let totalItemsInBox = 0;

    const formattedItems = parts.map(part => {
      const trimmed = part.trim();
      if (!trimmed) return null;
      const qtyMatch = trimmed.match(/(\d+)\s*x|x\s*(\d+)/i);
      const qty = qtyMatch ? parseInt(qtyMatch[1] || qtyMatch[2]) : 1;
      totalItemsInBox += qty;
      return `* ${trimmed}`;
    }).filter(Boolean).join('\n');

    // Requirement I: Status Percentage
    let statusPercent = 0;
    const status = (item.storageStatus || '').toLowerCase();
    if (status.includes('25%')) statusPercent = 25;
    else if (status.includes('50%')) statusPercent = 50;
    else if (status.includes('75%')) statusPercent = 75;
    else if (status.includes('full') || status.includes('100%')) statusPercent = 100;

    individualTags.forEach(tag => {
      const pName = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
      processedRows.push({
        individual: pName,
        location: item.locationName,
        box: item.storageName,
        items: formattedItems,
        total: totalItemsInBox,
        barcode: item.barcode,
        statusPercent
      });
      personStats[pName] = (personStats[pName] || 0) + totalItemsInBox;
    });
  });

  const totalGlobal = Object.values(personStats).reduce((a, b) => a + b, 0);

  // 3. SVG PIE CHART
  const colors = ['#4E73DF', '#1CC88A', '#36B9CC', '#F6C23E', '#E74A3B'];
  let cumulative = 0;
  const slices = Object.entries(personStats).map(([name, val], i) => {
    const pct = totalGlobal > 0 ? val / totalGlobal : 0;
    const startX = Math.cos(2 * Math.PI * cumulative);
    const startY = Math.sin(2 * Math.PI * cumulative);
    cumulative += pct;
    const endX = Math.cos(2 * Math.PI * cumulative);
    const endY = Math.sin(2 * Math.PI * cumulative);
    const largeArc = pct > 0.5 ? 1 : 0;
    const d = pct === 1 ? "M -1 0 A 1 1 0 1 1 1 0 A 1 1 0 1 1 -1 0" : `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArc} 1 ${endX} ${endY} Z`;
    return { d, fill: colors[i % colors.length], name, pct: (pct * 100).toFixed(1) };
  });

  // 4. RENDERING
  return (
    <div style={styles.container}>
      <div style={{ textAlign: 'right', fontSize: '11px', color: '#999' }}>{now}</div>
      <h1 style={styles.header}>Housekeeper Bee Report</h1>
      <h3 style={styles.header}>Individual Tag Usage</h3>

      {processedRows.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #ccc' }}>
          <h3>No Records Found</h3>
          <p>The name tags (e.g. "Hugo", "Cherry") were not found in the name dictionary.</p>
          <small>Ensure the <code>human-names</code> package is installed and has data.</small>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', margin: '30px 0' }}>
            <svg viewBox="-1.1 -1.1 2.2 2.2" style={{ width: '200px', transform: 'rotate(-90deg)' }}>
              {slices.map((s, i) => <path key={i} d={s.d} fill={s.fill} />)}
            </svg>
            <div>
              {slices.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: s.fill, marginRight: '10px' }} />
                  <span style={{ fontSize: '12px' }}>{s.name} ({s.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="filter-select" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Filter by:</label>
            <select
              id="filter-select"
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All</option>
            </select>
          </div>

          <table id="sortableTable" style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Individual Tag Name</th>
                <th style={styles.th}>Location Name</th>
                <th style={styles.th}>Box Name</th>
                <th style={styles.th}>Storage Items Name</th>
                <th style={styles.th}>Total Number of Items</th>
                <th style={styles.th}>Box Capacity</th>
                <th style={styles.th}>Barcode</th>
              </tr>
            </thead>
            <tbody>
              {processedRows.map((row, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 'bold' }}>{row.individual}</td>
                  <td style={styles.td}>{row.location}</td>
                  <td style={styles.td}>{row.box}</td>
                  <td style={{ ...styles.td, whiteSpace: 'pre-line' }}>{row.items}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>{row.total}</td>
                  <td style={styles.td}>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.bar, width: `${row.statusPercent}%`, backgroundColor: '#36B9CC' }} />
                    </div>
                  </td>
                  <td style={styles.td}>
                    {row.barcode && <img src={`[!MY_API_SRV]/api/barcode/ean13?data=${row.barcode}`} style={{ width: '120px' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

module.exports = HousekeeperBeeReport;