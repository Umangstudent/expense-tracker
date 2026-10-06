export default function Categories() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>Categories</h3>
        <button className="btn btn-primary">+ New Category</button>
      </div>
      <div className="grid grid-cols-4">
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Food & Dining</h4>
          <p>12 Transactions</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Utilities</h4>
          <p>5 Transactions</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Transportation</h4>
          <p>8 Transactions</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Entertainment</h4>
          <p>3 Transactions</p>
        </div>
      </div>
    </div>
  );
}
