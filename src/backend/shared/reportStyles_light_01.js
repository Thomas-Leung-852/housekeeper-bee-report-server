// Original color pattern
const reportStyles_light_01 = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '10px'
  },
  
  subtitle: {
    color: '#718096',
    marginBottom: '30px',
    fontSize: '1.1rem'
  },
  
  // Stat Cards
  statCard: {
    padding: '25px',
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.9'
  },
  
  // Card colors
  cardTotal: { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  cardSuccess: { background: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  cardWarning: { background: 'linear-gradient(135deg, #fb923c, #f59e0b)' },
  cardDanger: { background: 'linear-gradient(135deg, #f87171, #ef4444)' },
  cardInfo: { background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white'
  },
  
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600'
  },
  
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #e5e7eb'
  },
  
  // Progress bars
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
    transition: 'all 0.3s'
  },
  
  bar100: { background: '#22c55e' },
  bar75: { background: '#3b82f6' },
  bar50: { background: '#f59e0b' },
  bar25: { background: '#ef4444' },
  bar0: { background: '#6b7280' }
};

export default reportStyles_light_01;