//  Kawaii Light Mode
const reportStyles = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: '"Quicksand", "Nunito", system-ui, -apple-system, sans-serif',
    background: 'linear-gradient(135deg, #fff5f7 0%, #ffffff 50%, #f0f9ff 100%)',
    borderRadius: '30px',
    boxShadow: '0 15px 40px rgba(255,182,193,0.2), 0 5px 15px rgba(173,216,230,0.15)',
    border: '3px solid rgba(255,192,203,0.3)'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 50%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px',
    letterSpacing: '-0.5px'
  },
  
  subtitle: {
    color: '#94a3b8',
    marginBottom: '30px',
    fontSize: '1.1rem',
    fontWeight: '500'
  },
  
  // Stat Cards
  statCard: {
    padding: '25px',
    borderRadius: '20px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset',
    border: '2px solid rgba(255,255,255,0.6)',
    transition: 'transform 0.2s ease'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '5px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.95',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  
  // Card colors - Kawaii pastels
  cardTotal: { 
    background: 'linear-gradient(135deg, #ffc4e1 0%, #ffb3d9 100%)',
    color: '#8b3a62',
    boxShadow: '0 8px 20px rgba(255,182,193,0.35)'
  },
  cardSuccess: { 
    background: 'linear-gradient(135deg, #b4f8c8 0%, #a0e7e5 100%)',
    color: '#2d6a4f',
    boxShadow: '0 8px 20px rgba(160,231,229,0.35)'
  },
  cardWarning: { 
    background: 'linear-gradient(135deg, #fff4a3 0%, #ffe66d 100%)',
    color: '#8b6914',
    boxShadow: '0 8px 20px rgba(255,230,109,0.35)'
  },
  cardDanger: { 
    background: 'linear-gradient(135deg, #ffb3ba 0%, #ffaaa5 100%)',
    color: '#c1121f',
    boxShadow: '0 8px 20px rgba(255,170,165,0.35)'
  },
  cardInfo: { 
    background: 'linear-gradient(135deg, #b4e4ff 0%, #95bdff 100%)',
    color: '#1e40af',
    boxShadow: '0 8px 20px rgba(149,189,255,0.35)'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 15px rgba(255,182,193,0.15)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '3px solid #ffd4e5',
    background: '#ffffff'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #c084fc 0%, #e879f9 50%, #fbbf24 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(192,132,252,0.2)'
  },
  
  th: {
    padding: '18px 15px',
    textAlign: 'left',
    fontWeight: '700',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    letterSpacing: '0.5px'
  },
  
  td: {
    padding: '15px',
    borderBottom: '2px solid #ffe4f0',
    color: '#475569',
    background: '#ffffff',
    fontWeight: '500'
  },
  
  // Progress bars
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  
  bar: {
    height: '24px',
    borderRadius: '12px',
    minWidth: '40px',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
    border: '2px solid rgba(255,255,255,0.6)'
  },
  
  bar100: { 
    background: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)',
    boxShadow: '0 3px 8px rgba(110,231,183,0.4)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #bfdbfe, #93c5fd)',
    boxShadow: '0 3px 8px rgba(147,197,253,0.4)'
  },
  bar50: { 
    background: 'linear-gradient(135deg, #fef08a, #fde047)',
    boxShadow: '0 3px 8px rgba(253,224,71,0.4)'
  },
  bar25: { 
    background: 'linear-gradient(135deg, #fecaca, #fca5a5)',
    boxShadow: '0 3px 8px rgba(252,165,165,0.4)'
  },
  bar0: { 
    background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
    boxShadow: '0 3px 8px rgba(209,213,219,0.4)'
  }
};

export default reportStyles;