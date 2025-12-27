// Makoto Shinkai Inspired Style
const reportStyles_shinkai = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: 'linear-gradient(180deg, #e3f2fd 0%, #fff8e1 50%, #ffe0b2 100%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(33, 150, 243, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
    letterSpacing: '1px'
  },
  
  subtitle: {
    color: '#5e92f3',
    marginBottom: '30px',
    fontSize: '1.1rem',
    fontStyle: 'italic',
    opacity: '0.9'
  },
  
  // Stat Cards
  statCard: {
    padding: '25px',
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.6)',
    position: 'relative'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.95',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  
  // Card colors - Sky and sunset inspired
  cardTotal: { 
    background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.95), rgba(33, 150, 243, 0.95))',
    borderColor: 'rgba(144, 202, 249, 0.8)'
  },
  cardSuccess: { 
    background: 'linear-gradient(135deg, rgba(102, 187, 106, 0.95), rgba(76, 175, 80, 0.95))',
    borderColor: 'rgba(165, 214, 167, 0.8)'
  },
  cardWarning: { 
    background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.95), rgba(255, 167, 38, 0.95))',
    borderColor: 'rgba(255, 204, 128, 0.8)'
  },
  cardDanger: { 
    background: 'linear-gradient(135deg, rgba(239, 83, 80, 0.95), rgba(229, 57, 53, 0.95))',
    borderColor: 'rgba(239, 154, 154, 0.8)'
  },
  cardInfo: { 
    background: 'linear-gradient(135deg, rgba(41, 182, 246, 0.95), rgba(3, 169, 244, 0.95))',
    borderColor: 'rgba(129, 212, 250, 0.8)'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.2)',
    borderRadius: '10px',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.8)'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.9), rgba(30, 136, 229, 0.9))',
    color: '#ffffff',
    borderBottom: '3px solid rgba(144, 202, 249, 0.6)'
  },
  
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.85rem',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
  },
  
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid rgba(144, 202, 249, 0.3)',
    color: '#1565c0',
    background: 'rgba(255, 255, 255, 0.6)'
  },
  
  // Progress bars - Sky gradient inspired
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
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
  },
  
  bar100: { 
    background: 'linear-gradient(90deg, #66bb6a, #81c784)',
    boxShadow: '0 2px 10px rgba(102, 187, 106, 0.5)'
  },
  bar75: { 
    background: 'linear-gradient(90deg, #42a5f5, #64b5f6)',
    boxShadow: '0 2px 10px rgba(66, 165, 245, 0.5)'
  },
  bar50: { 
    background: 'linear-gradient(90deg, #ffb74d, #ffcc80)',
    boxShadow: '0 2px 10px rgba(255, 183, 77, 0.5)'
  },
  bar25: { 
    background: 'linear-gradient(90deg, #ef5350, #e57373)',
    boxShadow: '0 2px 10px rgba(239, 83, 80, 0.5)'
  },
  bar0: { 
    background: 'linear-gradient(90deg, #90a4ae, #b0bec5)',
    boxShadow: '0 2px 8px rgba(144, 164, 174, 0.4)'
  }
};

export default reportStyles_shinkai;