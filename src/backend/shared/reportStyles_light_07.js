// Container - Soft Sakura-iro (Cherry Blossom Pink) theme
// A pale, delicate pink symbolizing spring, youth, and new beginnings.
const reportStyles_sakura_01 = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: 'linear-gradient(145deg, #fffafa 0%, #fdeff2 100%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(255,182,193,0.3), 0 0 0 1px rgba(255,255,255,0.9)',
    border: '1px solid #f9d9e2',
    color: '#5a4a4a'
  },
  
  // Typography - Elegant and soft
  header: {
    fontSize: '2.8rem',
    fontWeight: '600',
    color: '#d86d8d',
    marginBottom: '10px',
    textShadow: '0 1px 2px rgba(0,0,0,0.05)',
    fontStyle: 'italic'
  },
  
  subtitle: {
    color: '#a68a8f',
    marginBottom: '30px',
    fontSize: '1.2rem',
    fontWeight: '300'
  },
  
  // Stat Cards - Delicate petal gradients
  statCard: {
    padding: '25px',
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(216,109,141,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
    border: '1px solid rgba(255,255,255,0.4)',
    backdropFilter: 'blur(8px)'
  },
  
  statNumber: {
    fontSize: '2.6rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  
  statLabel: {
    fontSize: '1rem',
    opacity: '0.95',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  
  // Card colors - Floral spring gradients
  cardTotal: { 
    background: 'linear-gradient(135deg, #f3a6b9 0%, #e888a1 100%)',
    boxShadow: '0 8px 25px rgba(243,166,185,0.4)'
  },
  cardSuccess: { 
    background: 'linear-gradient(135deg, #a8d5ba 0%, #8bc3a3 100%)',
    boxShadow: '0 8px 25px rgba(168,213,186,0.4)'
  },
  cardWarning: { 
    background: 'linear-gradient(135deg, #f9e1a1 0%, #f4d06f 100%)',
    boxShadow: '0 8px 25px rgba(249,225,161,0.4)'
  },
  cardDanger: { 
    background: 'linear-gradient(135deg, #f5b0a7 0%, #ee8a82 100%)',
    boxShadow: '0 8px 25px rgba(245,176,167,0.4)'
  },
  cardInfo: { 
    background: 'linear-gradient(135deg, #b8daeb 0%, #9bc3d9 100%)',
    boxShadow: '0 8px 25px rgba(184,218,235,0.4)'
  },
  
  // Table - Clean airy design
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #f9d9e2',
    background: 'rgba(255, 255, 255, 0.7)'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #f8c6d1 0%, #f3a6b9 100%)',
    color: '#8d4a5d',
    boxShadow: '0 2px 8px rgba(243,166,185,0.2)'
  },
  
  th: {
    padding: '18px 15px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '1.05rem',
    borderBottom: '2px solid #f9d9e2'
  },
  
  td: {
    padding: '14px 15px',
    borderBottom: '1px solid #fdf0f3',
    color: '#6e5a5e',
    background: '#ffffff',
    fontSize: '0.95rem'
  },
  
  // Progress bars - Pink petal depth
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  bar: {
    height: '18px',
    borderRadius: '9px',
    minWidth: '35px',
    display: 'inline-block',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid rgba(216,109,141,0.1)'
  },
  
  bar100: { 
    background: 'linear-gradient(135deg, #d86d8d, #e888a1)',
    boxShadow: '0 2px 6px rgba(216,109,141,0.3)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #f3a6b9, #f8c6d1)',
  },
  bar50: { 
    background: 'linear-gradient(135deg, #fce1e7, #f8c6d1)',
  },
  bar25: { 
    background: 'linear-gradient(135deg, #fff0f3, #fce1e7)',
  },
  bar0: { 
    background: '#f5f5f5',
    boxShadow: 'none'
  }
};

export default reportStyles_sakura_01;