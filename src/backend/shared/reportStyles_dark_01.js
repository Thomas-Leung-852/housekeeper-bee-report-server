const reportStyles_dark_01 = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: 'linear-gradient(145deg, #1a1d29 0%, #252936 100%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#f0f4f8',
    marginBottom: '10px',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
  },
  
  subtitle: {
    color: '#9ca3af',
    marginBottom: '30px',
    fontSize: '1.1rem'
  },
  
  // Stat Cards
  statCard: {
    padding: '25px',
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.9'
  },
  
  // Card colors - Dark mode gradients
  cardTotal: { 
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    boxShadow: '0 8px 25px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
  },
  cardSuccess: { 
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    boxShadow: '0 8px 25px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
  },
  cardWarning: { 
    background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    boxShadow: '0 8px 25px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
  },
  cardDanger: { 
    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    boxShadow: '0 8px 25px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
  },
  cardInfo: { 
    background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
    boxShadow: '0 8px 25px rgba(6,182,212,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(30,33,45,0.6)'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
    color: '#f0f4f8',
    boxShadow: '0 2px 10px rgba(124,58,237,0.3)'
  },
  
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
    borderBottom: '2px solid rgba(255,255,255,0.1)'
  },
  
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: '#e5e7eb',
    background: 'rgba(30,33,45,0.4)'
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
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  
  bar100: { 
    background: 'linear-gradient(135deg, #059669, #10b981)',
    boxShadow: '0 2px 8px rgba(16,185,129,0.4)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    boxShadow: '0 2px 8px rgba(59,130,246,0.4)'
  },
  bar50: { 
    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
    boxShadow: '0 2px 8px rgba(245,158,11,0.4)'
  },
  bar25: { 
    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
    boxShadow: '0 2px 8px rgba(239,68,68,0.4)'
  },
  bar0: { 
    background: 'linear-gradient(135deg, #4b5563, #6b7280)',
    boxShadow: '0 2px 8px rgba(107,114,128,0.4)'
  }
};

export default reportStyles_dark_01;