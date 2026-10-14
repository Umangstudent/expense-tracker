import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [expRes, catRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/categories'),
      ]);
      setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
      const cats = Array.isArray(catRes.data) ? catRes.data : [];
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load expenses data:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to fetch expenses or categories.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingExpense(null);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount || '');
    setDescription(expense.description || '');
    setDate(
      expense.date ? expense.date.substring(0, 10) : new Date().toISOString().split('T')[0]
    );
    setCategoryId(
      expense.category?.id ||
      expense.categoryId ||
      (categories.length > 0 ? categories[0].id : '')
    );
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setFormError('Please enter a valid positive amount.');
      return;
    }
    if (!categoryId) {
      setFormError('Please select a category.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    const payload = {
      amount: parseFloat(amount),
      description,
      date,
      category: { id: Number(categoryId) },
    };

    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, payload);
      } else {
        await api.post('/expenses', payload);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error('Save expense failed:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save expense. Please try again.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete expense failed:', err);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to delete expense.'
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3>Expense Records</h3>
          <p style={{ margin: 0 }}>Keep track of your spending</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Expense
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
          <p>Loading expenses...</p>
        </div>
      ) : (
        <div className="glass-card table-container">
          {expenses.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No expense records found</p>
              <span>Click the "+ Add Expense" button above to record your first expense.</span>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const cat = expense.category;
                  const catColor = cat?.color || '#8b5cf6';
                  return (
                    <tr key={expense.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {expense.date ? expense.date.substring(0, 10) : 'N/A'}
                      </td>
                      <td>
                        <strong>{expense.description || 'No description'}</strong>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: `${catColor}22`,
                            color: catColor,
                            border: `1px solid ${catColor}55`,
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: catColor,
                              display: 'inline-block',
                            }}
                          />
                          {cat?.name || expense.categoryName || 'Uncategorized'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--danger)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        -{formatCurrency(expense.amount)}
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="btn-icon"
                            onClick={() => openEditModal(expense)}
                            title="Edit Expense"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-icon btn-icon-danger"
                            onClick={() => handleDelete(expense.id)}
                            title="Delete Expense"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
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
                <label className="form-label" htmlFor="expense-amount">Amount ($)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="expense-amount"
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
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expense-desc">Description</label>
                <input
                  id="expense-desc"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Grocery shopping, Electricity bill"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expense-category">Category</label>
                <select
                  id="expense-category"
                  className="form-control"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.25rem', display: 'block' }}>
                    No categories found. Please create a category first.
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expense-date">Date</label>
                <input
                  id="expense-date"
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
                  ) : editingExpense ? (
                    'Update Expense'
                  ) : (
                    'Add Expense'
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
