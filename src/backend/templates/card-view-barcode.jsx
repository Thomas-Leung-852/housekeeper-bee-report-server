const React = require('react');

/**
 * AI Assistant: Gemini
 * AI Model: Gemini 1.5 Pro
 * Housekeeper Bee Report: Box Barcode Stock Take List
 */

const HousekeeperBeeReport = ({ data }) => {
  // --- Metadata Calculation ---
  const reportDate = "2026-01-05";
  const reportTime = "15:30";
  const creator = "Gemini AI";
  const modelInfo = "Gemini 1.5 Pro";
  const assistantName = "Gemini";
  const duration = "45 seconds";

  // --- Rule J: Status Percentage Check Sequence ---
  const getStatusPercent = (item) => {
    let statusPercent = 0;
    const status = (item.storageStatus || '').toLowerCase();
    
    if (status.includes('25% occupied')) {
      statusPercent = 25;
    } else if (status.includes('50% occupied')) {
      statusPercent = 50;
    } else if (status.includes('75% occupied')) {
      statusPercent = 75;
    } else if (status.includes('fully') || status.includes('full') || status.includes('100%')) {
      statusPercent = 100;
    } else if (status.includes('empty') || status.includes('0%')) {
      statusPercent = 0;
    } else {
      const percentMatch = status.match(/(\d+)%/);
      if (percentMatch) {
        statusPercent = parseInt(percentMatch[1]);
      }
    }
    return statusPercent;
  };

  // --- Summary Logic ---
  const totalBoxes = (data || []).length;
  const boxesWithBarcode = (data || []).filter(item => item.barcode).length;
  
  const stats = (data || []).reduce((acc, item) => {
    const p = getStatusPercent(item);
    if (p >= 100) acc.full++;
    else if (p === 0) acc.empty++;
    else acc.occupied++;
    return acc;
  }, { full: 0, occupied: 0, empty: 0 });

  // --- Rule K: SVG Circular Gauge ---
  const renderGauge = (percent) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    return (
      <svg width="60" height="60" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={radius} fill="transparent" stroke="rgba(128,128,128,0.2)" strokeWidth="3" />
        <circle cx="20" cy="20" r={radius} fill="transparent" stroke="currentColor" strokeWidth="3" 
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 20 20)" />
        <text x="20" y="22" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="bold">{percent}%</text>
      </svg>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header & Metadata Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={styles.header}>Housekeeper Bee Report</h1>
          <h3 style={styles.subtitle}>Box Barcode Stock Take List & Inventory Summary</h3>
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', opacity: 0.8 }}>
          <div>{reportDate} {reportTime}</div>
          <div>Report Template Created by: {creator}</div>
          <div>{modelInfo}</div>
          <div>{assistantName}</div>
          <div>Duration: {duration}</div>
        </div>
      </div>

      {/* Summary Section */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ ...styles.statCard, ...styles.cardTotal, flex: '1 1 150px' }}>
          <div style={styles.statLabel}>Total Boxes</div>
          <div style={styles.statNumber}>{totalBoxes}</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardInfo, flex: '1 1 150px' }}>
          <div style={styles.statLabel}>With Barcode</div>
          <div style={styles.statNumber}>{boxesWithBarcode}</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardSuccess, flex: '1 1 150px' }}>
          <div style={styles.statLabel}>Full Boxes</div>
          <div style={styles.statNumber}>{stats.full}</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardWarning, flex: '1 1 150px' }}>
          <div style={styles.statLabel}>Occupied</div>
          <div style={styles.statNumber}>{stats.occupied}</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.cardDanger, flex: '1 1 150px' }}>
          <div style={styles.statLabel}>Empty</div>
          <div style={styles.statNumber}>{stats.empty}</div>
        </div>
      </div>

      {/* Card Gallery Section */}
      <h2 style={{ ...styles.header, fontSize: '1.4rem', marginBottom: '15px' }}>📦 Box Barcode Gallery</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {(data || []).map((item, idx) => {
          const percent = getStatusPercent(item);
          // Choose card style based on status
          let cardStatusStyle = styles.cardInfo;
          if (percent >= 100) cardStatusStyle = styles.cardSuccess;
          else if (percent > 0) cardStatusStyle = styles.cardWarning;
          else cardStatusStyle = styles.cardDanger;

          return (
            <div key={idx} style={{ ...styles.statCard, ...cardStatusStyle, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* White scan-friendly area for Barcode */}
              <div style={{ background: '#fff', padding: '15px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                {item.barcode ? (
                  <img 
                    src={`[!MY_API_SRV]/api/barcode/ean13?data=${item.barcode}`} 
                    style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto' }} 
                    alt="barcode"
                  />
                ) : (
                  <div style={{ color: '#999', padding: '10px', fontSize: '14px' }}>No Barcode Available</div>
                )}
                <div style={{ color: '#333', fontFamily: 'monospace', fontSize: '12px', marginTop: '8px' }}>
                  {item.barcode || 'N/A'}
                </div>
              </div>

              {/* Information Body - Inherits theme color from statCard variant */}
              <div style={{ padding: '15px', textAlign: 'center', flexGrow: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{item.storageName}</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Location: {item.locationName}</div>
                
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                  {renderGauge(percent)}
                  <div style={{ textAlign: 'left', fontSize: '11px' }}>
                    <div>Status:</div>
                    <div style={{ fontWeight: 'bold' }}>{item.storageStatus || 'Unknown'}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

module.exports = HousekeeperBeeReport;