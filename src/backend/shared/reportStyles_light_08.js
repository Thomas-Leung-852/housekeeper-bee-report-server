// Container - Spacious and Serene Creamy Off-White
// Pantone's 2026 "Color of the Year," this creamy off-white is a popular British choice for creating spacious, serene interiors.
const reportStyles_cloud_dancer_01 = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    background: '#f0ede5', // Cloud Dancer Base
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05), inset 0 0 0 1px #e2dfd5',
    border: '1px solid #dcd9cf',
    color: '#43423e'
  },
  
  // Typography - Minimalist and Modern
  header: {
    fontSize: '2.4rem',
    fontWeight: '300',
    letterSpacing: '-0.5px',
    color: '#2c2b28',
    marginBottom: '10px',
    textTransform: 'capitalize'
  },
  
  subtitle: {
    color: '#7a7872',
    marginBottom: '35px',
    fontSize: '1rem',
    fontWeight: '400',
    letterSpacing: '0.5px'
  },
  
  // Stat Cards - Tonal and Understated
  statCard: {
    padding: '30px',
    borderRadius: '8px',
    color: '#43423e',
    textAlign: 'left',
    background: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    border: '1px solid #e2dfd5',
    backdropFilter: 'none'
  },
  
  statNumber: {
    fontSize: '2.2rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#2c2b28'
  },
  
  statLabel: {
    fontSize: '0.85rem',
    color: '#8e8c84',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    fontWeight: '500'
  },
  
  // Card colors - Soft Neutral Accents
  cardTotal: { 
    borderLeft: '4px solid #b2aea1',
    background: '#ffffff'
  },
  cardSuccess: { 
    borderLeft: '4px solid #96a396',
    background: '#ffffff'
  },
  cardWarning: { 
    borderLeft: '4px solid #d4c4a8',
    background: '#ffffff'
  },
  cardDanger: { 
    borderLeft: '4px solid #c9b4b4',
    background: '#ffffff'
  },
  cardInfo: { 
    borderLeft: '4px solid #a8b9c4',
    background: '#ffffff'
  },
  
  // Table - Clean Structured Layout
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    marginTop: '30px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e2dfd5',
    background: '#ffffff'
  },
  
  tableHeader: {
    background: '#f8f7f2',
    color: '#2c2b28',
    borderBottom: '1px solid #e2dfd5'
  },
  
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#5a5852',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  td: {
    padding: '16px 20px',
    borderBottom: '1px solid #f0ede5',
    color: '#5a5852',
    background: '#ffffff',
    fontSize: '0.95rem'
  },
  
  // Progress bars - Subdued Tones
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  bar: {
    height: '8px',
    borderRadius: '4px',
    minWidth: '40px',
    display: 'inline-block',
    transition: 'width 0.6s ease-in-out',
    background: '#e2dfd5' // Empty track color
  },
  
  bar100: { 
    background: '#96a396', // Sage/Moss neutral
  },
  bar75: { 
    background: '#b2aea1', // Deep Khaki neutral
  },
  bar50: { 
    background: '#c5c1b5', // Mid-tone Cloud
  },
  bar25: { 
    background: '#dcd9cf', // Soft shadow
  },
  bar0: { 
    background: '#f0ede5',
  }
};

export default reportStyles_cloud_dancer_01;