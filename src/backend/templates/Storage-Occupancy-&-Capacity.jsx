/**
 * AI Assistant: Housekeeper Bee
 * AI Model: Gemini 3 Flash (v1.0)
 * Report Template Created by: Gemini 3 Flash
 */

const React = require('react');

const HousekeeperBeeReport = ({ data }) => {
    const now = new Date();
    const dateTimeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    // --- DATA TRANSFORMATION & LOGIC ---

    const processedData = (data || []).map(item => {
        // Parse status to percentage (Section J)
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

        // Format storage items (Section C)
        // Replace commas with line breaks and add an asterisk before each item
        const formattedDesc = (item.storageDesc || '')
            .split(/[,，]/)
            .filter(part => part.trim().length > 0)
            .map(part => `* ${part.trim()}`)
            .join('\n');

        // Color coding for visual indicators
        let color = '#28a745'; // Green (Available)
        if (statusPercent >= 90) {
            color = '#dc3545'; // Red (Full)
        } else if (statusPercent >= 70) {
            color = '#ffc107'; // Orange (Nearly full)
        }

        return {
            ...item,
            statusPercent,
            formattedDesc,
            indicatorColor: color
        };
    });

    // Summary calculations
    const totalBoxes = processedData.length;
    const fullBoxes = processedData.filter(i => i.statusPercent >= 90).length;
    const avgUsage = totalBoxes > 0 
        ? Math.round(processedData.reduce((acc, curr) => acc + curr.statusPercent, 0) / totalBoxes) 
        : 0;

    // SVG Circular Gauge Helper
    const renderGauge = (percent, color) => {
        const radius = 18;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;

        return (
            <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto' }}>
                <svg width="60" height="60" viewBox="0 0 44 44">
                    {/* Background Circle */}
                    <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        fill="transparent"
                        stroke="#e6e6e6"
                        strokeWidth="4"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 22 22)"
                        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                    />
                    <text 
                        x="50%" 
                        y="50%" 
                        dominantBaseline="central" 
                        textAnchor="middle" 
                        fontSize="10" 
                        fontWeight="bold"
                        fill="#333"
                    >
                        {percent}%
                    </text>
                </svg>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            {/* Metadata Header (Section C) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h1 style={styles.header}>Housekeeper Bee Report</h1>
                    <h2 style={styles.subtitle}>Storage Occupancy & Capacity Report</h2>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: '1.4' }}>
                    <div>{dateTimeStr}</div>
                    <div>Report Template Created by: Gemini 3 Flash</div>
                    <div>Gemini 3 Flash v1.0</div>
                    <div>Housekeeper Bee</div>
                    <div>Duration: 00:01:45</div>
                </div>
            </div>

            {/* Summary Statistics */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ ...styles.statCard, ...styles.cardInfo, flex: 1 }}>
                    <div style={styles.statLabel}>Total Boxes</div>
                    <div style={styles.statNumber}>{totalBoxes}</div>
                </div>
                <div style={{ ...styles.statCard, ...styles.cardDanger, flex: 1 }}>
                    <div style={styles.statLabel}>Full/Near Full</div>
                    <div style={styles.statNumber}>{fullBoxes}</div>
                </div>
                <div style={{ ...styles.statCard, ...styles.cardWarning, flex: 1 }}>
                    <div style={styles.statLabel}>Avg Capacity Usage</div>
                    <div style={styles.statNumber}>{avgUsage}%</div>
                </div>
            </div>

            {/* Filter UI (Section I) */}
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <label htmlFor='filter-select' style={{ fontWeight: 'bold' }}>Filter by:</label>
                <select id='filter-select' style={{ maxWidth: '900px', marginLeft: '10px', padding: '5px' }}>
                    <option value=''>All Locations</option>
                    {[...new Set(processedData.map(d => d.locationName))].map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <table id="sortableTable" style={styles.table}>
                <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.th}>Location & Box Name</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Occupancy Gauge</th>
                        <th style={styles.th}>Contents</th>
                        <th style={styles.th}>Tags</th>
                        <th style={styles.th}>Barcode (EAN-13)</th>
                    </tr>
                </thead>
                <tbody>
                    {processedData.map((row, idx) => (
                        <tr key={idx}>
                            <td style={styles.td}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{row.storageName}</div>
                                <div style={{ color: '#666', fontSize: '0.9rem' }}>📍 {row.locationName}</div>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                                {renderGauge(row.statusPercent, row.indicatorColor)}
                            </td>
                            <td style={{ ...styles.td, whiteSpace: 'pre-line', fontSize: '0.85rem' }}>
                                {row.formattedDesc}
                            </td>
                            <td style={styles.td}>
                                {row.tags && row.tags.map(tag => (
                                    <span key={tag} style={{ 
                                        display: 'inline-block', 
                                        backgroundColor: '#eee', 
                                        padding: '2px 6px', 
                                        borderRadius: '4px', 
                                        margin: '2px', 
                                        fontSize: '0.75rem' 
                                    }}>
                                        #{tag}
                                    </span>
                                ))}
                            </td>
                            {/* Barcode (Section M) */}
                            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.9rem', textAlign: 'center' }}>
                                {row.barcode ? (
                                    <React.Fragment>
                                        <img
                                            alt=''
                                            src={`[!MY_API_SRV]/api/barcode/ean13?data=${row.barcode}`}
                                            style={{ width: '150px' }}
                                        />
                                        <br />
                                        {row.barcode}
                                    </React.Fragment>
                                ) : (
                                    <span>No Barcode</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

module.exports = HousekeeperBeeReport;