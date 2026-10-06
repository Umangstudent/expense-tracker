export default function Expenses() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>Expense Records</h3>
        <button className="btn btn-primary">+ Add Expense</button>
      </div>
      <div className="glass-card table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-10-04</td>
              <td>Grocery shopping</td>
              <td>Food</td>
              <td style={{ color: 'var(--danger)' }}>-$120.00</td>
            </tr>
            <tr>
              <td>2026-10-02</td>
              <td>Internet Bill</td>
              <td>Utilities</td>
              <td style={{ color: 'var(--danger)' }}>-$60.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
