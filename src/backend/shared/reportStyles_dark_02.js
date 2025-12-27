// Luxurious Jewel-Toned Dark Mode
const reportStyles_jewel_dark = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#0f0f1a',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)',
     color: '#e9d5ff'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#e9d5ff',
    marginBottom: '10px',
    textShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
  },
  
  subtitle: {
    color: '#c4b5fd',
    marginBottom: '30px',
    fontSize: '1.1rem'
  },
  
  // Stat Cards
  statCard: {
    padding: '25px',
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: '0 0 10px rgba(255,255,255,0.3)'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.9'
  },
  
  // Card colors - Jewel tones
  cardTotal: { background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' },
  cardSuccess: { background: 'linear-gradient(135deg, #10b981, #047857)' },
  cardWarning: { background: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  cardDanger: { background: 'linear-gradient(135deg, #dc2626, #991b1b)' },
  cardInfo: { background: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 20px rgba(139, 92, 246, 0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(139, 92, 246, 0.3)'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#f0f9ff',
    borderBottom: '2px solid rgba(139, 92, 246, 0.5)'
  },
  
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.85rem'
  },
  
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    color: '#e0e7ff',
    background: 'rgba(15, 15, 26, 0.5)'
  },
  
  // Progress bars - Jewel tones
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  
  bar: {
    height: '20px',
    borderRadius: '10px',
    minWidth: '30px',
    display: 'inline-block',
    transition: 'all 0.3s',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
  },
  
  bar100: { 
    background: 'linear-gradient(90deg, #10b981, #059669)',
    boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)'
  },
  bar75: { 
    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
  },
  bar50: { 
    background: 'linear-gradient(90deg, #f59e0b, #d97706)',
    boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)'
  },
  bar25: { 
    background: 'linear-gradient(90deg, #ef4444, #dc2626)',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
  },
  bar0: { 
    background: 'linear-gradient(90deg, #475569, #334155)',
    boxShadow: '0 0 10px rgba(71, 85, 105, 0.3)'
  }
};

export default reportStyles_jewel_dark;