// Professional Print-Optimized Stylesheet
const reportStyles_print_optimized = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    background: '#ffffff',
    borderRadius: '0px',
    boxShadow: 'none',
    color: '#000000',
    border: '2px solid #2c3e50'
  },
  
  // Typography
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '8px',
    textShadow: 'none',
    borderBottom: '3px solid #2c3e50',
    paddingBottom: '10px'
  },
  
  subtitle: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '1rem',
    fontWeight: '500'
  },
  
  // Stat Cards - Solid colors with borders for print
  statCard: {
    padding: '20px',
    borderRadius: '8px',
    color: '#1a1a1a',
    textAlign: 'center',
    boxShadow: 'none',
    border: '2px solid #2c3e50',
    fontWeight: '600'
  },
  
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: 'none'
  },
  
  statLabel: {
    fontSize: '0.85rem',
    opacity: '1',
    fontWeight: '500'
  },
  
  // Card colors - Print-friendly with patterns/borders for differentiation
  cardTotal: { 
    background: '#e8f4f8',
    borderColor: '#2980b9',
    borderWidth: '3px'
  },
  cardSuccess: { 
    background: '#e8f8f5',
    borderColor: '#27ae60',
    borderWidth: '3px'
  },
  cardWarning: { 
    background: '#fef5e7',
    borderColor: '#f39c12',
    borderWidth: '3px'
  },
  cardDanger: { 
    background: '#fadbd8',
    borderColor: '#c0392b',
    borderWidth: '3px'
  },
  cardInfo: { 
    background: '#ebf5fb',
    borderColor: '#3498db',
    borderWidth: '3px'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: 'none',
    borderRadius: '0px',
    overflow: 'visible',
    border: '2px solid #2c3e50'
  },
  
  tableHeader: {
    background: '#ecf0f1',
    color: '#1a1a1a',
    borderBottom: '3px solid #2c3e50'
  },
  
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.8rem',
    border: '1px solid #95a5a6',
    cursor: 'pointer'
  },
  
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #bdc3c7',
    border: '1px solid #bdc3c7',
    color: '#1a1a1a',
    background: '#ffffff'
  },
  
  // Progress bars - Solid colors for print clarity
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #7f8c8d',
    borderRadius: '4px',
    padding: '2px',
    background: '#ffffff'
  },
  
  bar: {
    height: '18px',
    borderRadius: '3px',
    minWidth: '30px',
    display: 'inline-block',
    transition: 'none',
    boxShadow: 'none',
    border: '1px solid #2c3e50',
    textAlign: 'center',
    lineHeight: '18px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#1a1a1a'
  },
  
  bar100: { 
    background: '#27ae60',
    borderColor: '#1e8449'
  },
  bar75: { 
    background: '#3498db',
    borderColor: '#2874a6'
  },
  bar50: { 
    background: '#f39c12',
    borderColor: '#d68910'
  },
  bar25: { 
    background: '#e74c3c',
    borderColor: '#c0392b'
  },
  bar0: { 
    background: '#95a5a6',
    borderColor: '#7f8c8d'
  }
};

export default reportStyles_print_optimized;