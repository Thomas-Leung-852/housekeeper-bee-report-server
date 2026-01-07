/* 
Prompt: 
Market Spice & Sunny Days
Inspired by the vibrant food scene and sunny weather, this palette is warmer and uses food-related colors that evoke happiness and appetite. Yellow and orange are prominent happy colors in Hong Kong culture.
Background Base: Oatmeal Warm or Creamy White (#FFFDF5).
Primary Accent (Happiness/Prosperity): Apricot Yellow or Mandarin Orange.
Secondary Accent (Freshness): Crisp White for cleanliness or a vibrant Lime Green for contrast.
*/
// Market Spice & Sunny Days Style (Hong Kong Inspired)
const reportStyles_kodomomuke = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
    background: 'linear-gradient(135deg, #fffdf5 0%, #fff9e6 50%, #fff4d9 100%)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255, 140, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(255, 165, 79, 0.2)',
    position: 'relative'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: '400',
    color: '#d97706',
    marginBottom: '10px',
    textShadow: 'none',
    letterSpacing: '0.5px',
    textTransform: 'none'
  },
  
  subtitle: {
    color: '#ea580c',
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
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transform: 'none',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  
  statNumber: {
    fontSize: '2.8rem',
    fontWeight: '300',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    opacity: '0.95'
  },
  
  // Card colors - Warm food-inspired palette
  cardTotal: { 
    background: 'linear-gradient(135deg, #fb923c, #f97316)',
    transform: 'none'
  },
  cardSuccess: { 
    background: 'linear-gradient(135deg, #84cc16, #65a30d)',
    transform: 'none'
  },
  cardWarning: { 
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    transform: 'none'
  },
  cardDanger: { 
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    transform: 'none'
  },
  cardInfo: { 
    background: 'linear-gradient(135deg, #fcd34d, #fbbf24)',
    transform: 'none'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    marginTop: '20px',
    boxShadow: '0 4px 16px rgba(251, 146, 60, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(251, 146, 60, 0.2)',
    background: 'white'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #fb923c, #f97316)',
    color: '#ffffff',
    borderBottom: '1px solid rgba(249, 115, 22, 0.3)'
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
    borderBottom: '1px solid rgba(255, 244, 217, 0.5)',
    color: '#292524',
    fontWeight: '400',
    fontSize: '0.95rem'
  },
  
  // Progress bars - Warm and vibrant
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
    background: 'linear-gradient(135deg, #84cc16, #65a30d)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar50: { 
    background: 'linear-gradient(135deg, #fb923c, #f97316)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar25: { 
    background: 'linear-gradient(135deg, #fdba74, #fb923c)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)'
  },
  bar0: { 
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

export default reportStyles_kodomomuke;