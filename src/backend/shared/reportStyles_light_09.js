// Urban Tranquility Style (Hong Kong Inspired)
/* 
Prompt: 
Hong Kong: "Urban Tranquility"
Hong Kong design often balances fast-paced urban life with a need for tranquil, classic retreats. The 2026 light mode is elegant, utilizing natural materials and sophisticated neutrals.
Beige Marble & Teal: An effortlessly elegant style (Urban Tranquility). It pairs a Beige Marble base (a sophisticated cream/beige neutral) with a vibrant Teal accent color. This combination uses classic, timeless neutrals (#DBCDBA base, #008080 teal) enhanced by a lively jolt of color that adds dimension without being overwhelming.
*/
// Urban Tranquility Style (Hong Kong Inspired)
const reportStyles_kodomomuke = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
    background: 'linear-gradient(135deg, #f5f1ed 0%, #e8e0d8 50%, #dbcdba 100%)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(219, 205, 186, 0.3)',
    position: 'relative'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: '300',
    color: '#2c2c2c',
    marginBottom: '10px',
    textShadow: 'none',
    letterSpacing: '0.5px',
    textTransform: 'none'
  },
  
  subtitle: {
    color: '#5a5a5a',
    marginBottom: '30px',
    fontSize: '1.1rem',
    fontWeight: '400',
    textShadow: 'none'
  },
  
  // Stat Cards
  statCard: {
    padding: '30px',
    borderRadius: '12px',
    color: 'white',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'none',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  
  statNumber: {
    fontSize: '2.8rem',
    fontWeight: '300',
    marginBottom: '8px',
    textShadow: 'none'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    opacity: '0.95'
  },
  
  // Card colors - Sophisticated neutrals with teal accents
  cardTotal: { 
    background: 'linear-gradient(135deg, #008080, #006666)',
    transform: 'none'
  },
  cardSuccess: { 
    background: 'linear-gradient(135deg, #4a7c7e, #357373)',
    transform: 'none'
  },
  cardWarning: { 
    background: 'linear-gradient(135deg, #c4a57b, #b89968)',
    transform: 'none'
  },
  cardDanger: { 
    background: 'linear-gradient(135deg, #8b7355, #7a6147)',
    transform: 'none'
  },
  cardInfo: { 
    background: 'linear-gradient(135deg, #5c9a9e, #4a8a8e)',
    transform: 'none'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    marginTop: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(219, 205, 186, 0.4)',
    background: 'white'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #008080, #006b6b)',
    color: '#ffffff',
    borderBottom: '1px solid rgba(0, 102, 102, 0.3)'
  },
  
  th: {
    padding: '18px',
    textAlign: 'left',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontSize: '0.85rem',
    textShadow: 'none'
  },
  
  td: {
    padding: '15px 18px',
    borderBottom: '1px solid rgba(219, 205, 186, 0.25)',
    color: '#3a3a3a',
    fontWeight: '400',
    fontSize: '0.95rem'
  },
  
  // Progress bars - Clean and minimal
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  bar: {
    height: '20px',
    borderRadius: '10px',
    minWidth: '40px',
    display: 'inline-block',
    transition: 'all 0.3s',
    border: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  
  bar100: { 
    background: 'linear-gradient(135deg, #008080, #006666)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #4a9a9e, #3a8a8e)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar50: { 
    background: 'linear-gradient(135deg, #c4a57b, #b89968)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar25: { 
    background: 'linear-gradient(135deg, #9b8b7e, #8a7a6d)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar0: { 
    background: 'linear-gradient(135deg, #d4cec7, #c4beb7)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

export default reportStyles_kodomomuke;