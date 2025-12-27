//  Daytime Glow style
const reportStyles = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    background: 'linear-gradient(160deg, #fffef9 0%, #fffcf0 20%, #f0f9ff 60%, #e0f2fe 100%)',
    borderRadius: '24px',
    boxShadow: '0 12px 40px rgba(251, 191, 36, 0.12), 0 4px 12px rgba(14, 165, 233, 0.08)',
    border: '2px solid rgba(251, 191, 36, 0.15)'
  },
  
  // Typography
  header: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(120deg, #f59e0b 0%, #fbbf24 30%, #0ea5e9 70%, #0284c7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px',
    letterSpacing: '-0.5px',
    filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.2))'
  },
  
  subtitle: {
    color: '#64748b',
    marginBottom: '30px',
    fontSize: '1.1rem',
    fontWeight: '500',
    opacity: '0.85'
  },
  
  // Stat Cards
  statCard: {
    padding: '28px',
    borderRadius: '18px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,0.4)',
    border: '2px solid rgba(255,255,255,0.5)',
    backdropFilter: 'blur(8px)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '8px',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)',
    filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.5))'
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.95',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  
  // Card colors - Daytime glow palette
  cardTotal: { 
    background: 'linear-gradient(145deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%)',
    boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)',
    color: '#78350f'
  },
  cardSuccess: { 
    background: 'linear-gradient(145deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
    boxShadow: '0 10px 30px rgba(34, 197, 94, 0.35), inset 0 2px 0 rgba(255,255,255,0.4)',
    color: '#14532d'
  },
  cardWarning: { 
    background: 'linear-gradient(145deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)',
    boxShadow: '0 10px 30px rgba(251, 146, 60, 0.35), inset 0 2px 0 rgba(255,255,255,0.4)',
    color: '#7c2d12'
  },
  cardDanger: { 
    background: 'linear-gradient(145deg, #fca5a5 0%, #f87171 50%, #ef4444 100%)',
    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.35), inset 0 2px 0 rgba(255,255,255,0.4)',
    color: '#7f1d1d'
  },
  cardInfo: { 
    background: 'linear-gradient(145deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)',
    boxShadow: '0 10px 30px rgba(14, 165, 233, 0.35), inset 0 2px 0 rgba(255,255,255,0.4)',
    color: '#0c4a6e'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 20px rgba(251, 191, 36, 0.1), 0 2px 8px rgba(14, 165, 233, 0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid rgba(251, 191, 36, 0.2)',
    background: 'linear-gradient(180deg, #fffef9 0%, #ffffff 100%)'
  },
  
  tableHeader: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #0ea5e9 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)'
  },
  
  th: {
    padding: '18px 15px',
    textAlign: 'left',
    fontWeight: '700',
    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    letterSpacing: '0.3px'
  },
  
  td: {
    padding: '15px',
    borderBottom: '1px solid rgba(251, 191, 36, 0.1)',
    color: '#334155',
    background: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    transition: 'background 0.2s ease'
  },
  
  // Progress bars
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  
  bar: {
    height: '24px',
    borderRadius: '12px',
    minWidth: '40px',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 8px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.4)',
    border: '2px solid rgba(255,255,255,0.6)'
  },
  
  bar100: { 
    background: 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
  },
  bar75: { 
    background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
  },
  bar50: { 
    background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%)',
    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
  },
  bar25: { 
    background: 'linear-gradient(135deg, #fdba74 0%, #fb923c 50%, #f97316 100%)',
    boxShadow: '0 4px 12px rgba(251, 146, 60, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
  },
  bar0: { 
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
    boxShadow: '0 4px 12px rgba(148, 163, 184, 0.3), inset 0 2px 0 rgba(255,255,255,0.4)'
  }
};

export default reportStyles;