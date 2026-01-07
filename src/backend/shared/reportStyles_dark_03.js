 // Container - Deep Plum-Red (Divine Damson) Cocooning Effect
 /*
 A rich, "warm" dark mode that uses 2026's most popular UK heritage red for a cocooning effect.
Background: Divine Damson (Graham & Brown 2026 COTY—deep plum-red).
Text: Oatmeal Warm (A Japanese-style creamy neutral).
Accent: Cocoa Powder (A red-toned brown for grounding stability).
 */
const reportStyles_divine_damson_01 = {
  // Container - Deep Plum-Red (Divine Damson)
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: "'Playfair Display', 'Georgia', serif",
    background: '#4a2c3a', 
    '--text-primary': '#fdfcf0',   
    '--text-secondary': '#e2d6c1', 
    '--text-on-light': '#4a2c3a',  
    '--accent-priority': '#e63946',
    borderRadius: '16px',
    border: '1px solid #5d3a4a',
    color: '#FFFAFA' // Explicit Snow White for global text
  },
  
  // Typography - High Visibility
  header: {
    fontSize: '2.6rem',
    fontWeight: '700',
    color: '#FFFAFA', // Snow White
    marginBottom: '10px',
    textTransform: 'uppercase',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  
  subtitle: {
    color: '#F1EDE4', // Oatmeal Warm
    marginBottom: '35px',
    fontSize: '1.1rem',
    fontStyle: 'italic'
  },
  
  // Stat Cards
statCard: {
    padding: '30px',
    borderRadius: '12px',
    background: '#3d2430', 
    border: '1px solid #5d4440',
    color: '#FFFAFA' // Default text color for dark cards
  },
  
  statNumber: {
    fontSize: '3.2rem',
    fontWeight: 'bold',
    color: 'inherit', // Inherit from parent card
    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
  },
  
  statLabel: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'inherit', // Inherit from parent card
    opacity: 0.9
  },

  // Light Card Override
  cardInfo: { 
    background: '#F1EDE4', 
    color: '#4a2c3a', // Dark Plum-Red for text on light background
    border: '1px solid #c5b8a5'
  },
  
  // Table Visibility
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '30px',
    border: '1px solid #5d4440',
    background: 'rgba(0, 0, 0, 0.2)'
  },
  
  th: {
    padding: '18px 15px',
    color: '#FFFAFA', // Snow White Header
    fontWeight: '700',
    borderBottom: '2px solid #5d4440',
    background: '#351f29'
  },
  
  td: {
    padding: '14px 15px',
    color: '#F1EDE4', // Oatmeal Warm Row Text
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  }
};

export default reportStyles_divine_damson_01;