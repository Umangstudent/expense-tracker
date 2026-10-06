export default function Income() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>Income Records</h3>
        <button className="btn btn-primary">+ Add Income</button>
      </div>
      <div className="glass-card table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-10-01</td>
              <td>Salary</td>
              <td style={{ color: 'var(--success)' }}>+$4,500.00</td>
            </tr>
            <tr>
              <td>2026-09-15</td>
              <td>Freelance</td>
              <td style={{ color: 'var(--success)' }}>+$700.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
