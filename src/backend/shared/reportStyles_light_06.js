// Kodomomuke Style (Children's Anime Inspired)
const reportStyles_kodomomuke = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: '"Comic Sans MS", "Marker Felt", "Chalkboard SE", cursive, sans-serif',
    background: 'linear-gradient(135deg, #fff9c4 0%, #ffecb3 50%, #ffe082 100%)',
    borderRadius: '30px',
    boxShadow: '0 10px 40px rgba(255, 152, 0, 0.3)',
    border: '6px solid #ff6f00',
    position: 'relative'
  },
  
  // Typography
  header: {
    fontSize: '3rem',
    fontWeight: '900',
    color: '#e65100',
    marginBottom: '10px',
    textShadow: '4px 4px 0px #fff59d, 6px 6px 0px #ffa726',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  
  subtitle: {
    color: '#f57c00',
    marginBottom: '30px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 0px rgba(255, 255, 255, 0.8)'
  },
  
  // Stat Cards
  statCard: {
    padding: '30px',
    borderRadius: '25px',
    color: 'white',
    textAlign: 'center',
   // boxShadow: '0 6px 0px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.15)',
    border: '4px solid rgba(255, 255, 255, 0.9)',
    transform: 'rotate(-1deg)',
    transition: 'transform 0.3s'
  },
  
  statNumber: {
    fontSize: '3rem',
    fontWeight: '900',
    marginBottom: '8px',
    textShadow: '3px 3px 0px rgba(0, 0, 0, 0.2)'
  },
  
  statLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1.5px'
  },
  
  // Card colors - Bright and playful
  cardTotal: { 
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
    transform: 'rotate(1deg)'
  },
  cardSuccess: { 
    background: 'linear-gradient(135deg, #51cf66, #37b24d)',
    transform: 'rotate(-2deg)'
  },
  cardWarning: { 
    background: 'linear-gradient(135deg, #ffd93d, #fcc419)',
    transform: 'rotate(2deg)'
  },
  cardDanger: { 
    background: 'linear-gradient(135deg, #ff8787, #fa5252)',
    transform: 'rotate(-1deg)'
  },
  cardInfo: { 
    background: 'linear-gradient(135deg, #74c0fc, #4dabf7)',
    transform: 'rotate(1.5deg)'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    marginTop: '20px',
    boxShadow: '0 8px 0px rgba(255, 152, 0, 0.3), 0 12px 25px rgba(0,0,0,0.2)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '5px solid #ff6f00',
    background: 'white'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #ff6b6b, #fa5252)',
    color: '#ffffff',
    borderBottom: '5px solid #ff8787'
  },
  
  th: {
    padding: '18px',
    textAlign: 'left',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontSize: '1rem',
    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.2)'
  },
  
  td: {
    padding: '15px 18px',
    borderBottom: '3px dashed #ffe082',
    color: '#e65100',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  
  // Progress bars - Colorful and chunky
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  bar: {
    height: '26px',
    borderRadius: '13px',
    minWidth: '40px',
    display: 'inline-block',
    transition: 'all 0.3s',
    border: '3px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 0px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15)'
  },
  
  bar100: { 
    background: 'linear-gradient(135deg, #51cf66, #37b24d)',
    boxShadow: '0 4px 0px #2f9e44, 0 6px 12px rgba(56, 178, 77, 0.4)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #74c0fc, #4dabf7)',
    boxShadow: '0 4px 0px #339af0, 0 6px 12px rgba(77, 171, 247, 0.4)'
  },
  bar50: { 
    background: 'linear-gradient(135deg, #ffd93d, #fcc419)',
    boxShadow: '0 4px 0px #fab005, 0 6px 12px rgba(252, 196, 25, 0.4)'
  },
  bar25: { 
    background: 'linear-gradient(135deg, #ff8787, #fa5252)',
    boxShadow: '0 4px 0px #f03e3e, 0 6px 12px rgba(250, 82, 82, 0.4)'
  },
  bar0: { 
    background: 'linear-gradient(135deg, #ced4da, #adb5bd)',
    boxShadow: '0 4px 0px #868e96, 0 6px 12px rgba(173, 181, 189, 0.4)'
  }
};

export default reportStyles_kodomomuke;