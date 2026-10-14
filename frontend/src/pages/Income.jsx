import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const fetchIncomes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/incomes');
      setIncomes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load income data:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to fetch income records.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const openAddModal = () => {
    setEditingIncome(null);
    setAmount('');
    setSource('');
    setDate(new Date().toISOString().split('T')[0]);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (income) => {
    setEditingIncome(income);
    setAmount(income.amount || '');
    setSource(income.source || '');
    setDate(
      income.date ? income.date.substring(0, 10) : new Date().toISOString().split('T')[0]
    );
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingIncome(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setFormError('Please enter a valid positive amount.');
      return;
    }
    if (!source.trim()) {
      setFormError('Please enter an income source.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    const payload = {
      amount: parseFloat(amount),
      source: source.trim(),
      date,
    };

    try {
      if (editingIncome) {
        await api.put(`/incomes/${editingIncome.id}`, payload);
      } else {
        await api.post('/incomes', payload);
      }
      closeModal();
      fetchIncomes();
    } catch (err) {
      console.error('Save income failed:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save income record. Please try again.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) {
      return;
    }
    try {
      await api.delete(`/incomes/${id}`);
      setIncomes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete income failed:', err);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to delete income record.'
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3>Income Records</h3>
          <p style={{ margin: 0 }}>Track all your earnings and revenue</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Income
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
          <p>Loading incomes...</p>
        </div>
      ) : (
        <div className="glass-card table-container">
          {incomes.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No income records found</p>
              <span>Click the "+ Add Income" button above to record your first income.</span>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {income.date ? income.date.substring(0, 10) : 'N/A'}
                    </td>
                    <td>
                      <strong>{income.source || 'Income'}</strong>
                    </td>
                    <td style={{ color: 'var(--success)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      +{formatCurrency(income.amount)}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          className="btn-icon"
                          onClick={() => openEditModal(income)}
                          title="Edit Income"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDelete(income.id)}
                          title="Delete Income"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Edit Income Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingIncome ? 'Edit Income' : 'Add New Income'}</h3>
              <button className="modal-close-btn" onClick={closeModal} title="Close">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="income-amount">Amount ($)</label>
                <input
                  id="income-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={submitting}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="income-source">Source</label>
                <input
                  id="income-source"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Salary, Freelance project, Investment dividend"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="income-date">Date</label>
                <input
                  id="income-date"
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-glass"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-sm" /> Saving...
                    </>
                  ) : editingIncome ? (
                    'Update Income'
                  ) : (
                    'Add Income'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
