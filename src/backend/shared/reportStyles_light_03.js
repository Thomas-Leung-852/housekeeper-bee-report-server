// Studio Ghibli Style
const reportStyles = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
    background: 'linear-gradient(165deg, #fef9f3 0%, #f8f3ea 50%, #f0ebe2 100%)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(101, 84, 63, 0.12), 0 2px 8px rgba(139, 115, 85, 0.08)',
    border: '1px solid rgba(139, 115, 85, 0.15)'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#5a4a3a',
    marginBottom: '10px',
    letterSpacing: '-0.3px',
    textShadow: '0 1px 2px rgba(90, 74, 58, 0.1)'
  },
  
  subtitle: {
    color: '#8b7355',
    marginBottom: '30px',
    fontSize: '1.1rem',
    fontWeight: '400',
    opacity: '0.9'
  },
  
  // Stat Cards
  statCard: {
    padding: '28px',
    borderRadius: '12px',
    color: '#fef9f3',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(4px)'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '600',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.95',
    fontWeight: '500',
    letterSpacing: '0.3px'
  },
  
  // Card colors - Ghibli natural tones
  cardTotal: { 
    background: 'linear-gradient(145deg, #a8956f 0%, #8b7355 100%)',
    boxShadow: '0 6px 20px rgba(168, 149, 111, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
  },
  cardSuccess: { 
    background: 'linear-gradient(145deg, #7b9e7e 0%, #5f8561 100%)',
    boxShadow: '0 6px 20px rgba(123, 158, 126, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
  },
  cardWarning: { 
    background: 'linear-gradient(145deg, #d4a574 0%, #b8885d 100%)',
    boxShadow: '0 6px 20px rgba(212, 165, 116, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
  },
  cardDanger: { 
    background: 'linear-gradient(145deg, #c17b6f 0%, #a65b52 100%)',
    boxShadow: '0 6px 20px rgba(193, 123, 111, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
  },
  cardInfo: { 
    background: 'linear-gradient(145deg, #7b9aae 0%, #5d7b8f 100%)',
    boxShadow: '0 6px 20px rgba(123, 154, 174, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 12px rgba(101, 84, 63, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #e8dcc8',
    background: '#fefdfb'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #9d8b6f 0%, #8b7355 100%)',
    color: '#fef9f3',
    boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.1)'
  },
  
  th: {
    padding: '16px 15px',
    textAlign: 'left',
    fontWeight: '600',
    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
    borderBottom: '1px solid rgba(254, 249, 243, 0.1)',
    letterSpacing: '0.3px'
  },
  
  td: {
    padding: '14px 15px',
    borderBottom: '1px solid #f0e8da',
    color: '#5a4a3a',
    background: '#fefdfb',
    fontWeight: '400'
  },
  
  // Progress bars
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  
  bar: {
    height: '22px',
    borderRadius: '11px',
    minWidth: '35px',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
    border: '1px solid rgba(255,255,255,0.4)'
  },
  
  bar100: { 
    background: 'linear-gradient(135deg, #8ba888 0%, #6d8c6d 100%)',
    boxShadow: '0 2px 8px rgba(109, 140, 109, 0.3)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #8b9eb8 0%, #6d7f98 100%)',
    boxShadow: '0 2px 8px rgba(109, 127, 152, 0.3)'
  },
  bar50: { 
    background: 'linear-gradient(135deg, #d4a574 0%, #b8885d 100%)',
    boxShadow: '0 2px 8px rgba(212, 165, 116, 0.3)'
  },
  bar25: { 
    background: 'linear-gradient(135deg, #c89f8a 0%, #a8836f 100%)',
    boxShadow: '0 2px 8px rgba(200, 159, 138, 0.3)'
  },
  bar0: { 
    background: 'linear-gradient(135deg, #c4bcae 0%, #a8a095 100%)',
    boxShadow: '0 2px 8px rgba(196, 188, 174, 0.3)'
  }
};

export default reportStyles;