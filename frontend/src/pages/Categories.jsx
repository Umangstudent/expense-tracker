import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, X, AlertCircle, Tag } from 'lucide-react';

const PRESET_COLORS = [
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to fetch categories.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = () => {
    setName('');
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a category name.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await api.post('/categories', {
        name: name.trim(),
        color,
      });
      closeModal();
      fetchCategories();
    } catch (err) {
      console.error('Save category failed:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to create category. It might already exist.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error('Delete category failed:', err);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to delete category. It might be used by existing expenses.'
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3>Categories</h3>
          <p style={{ margin: 0 }}>Organize your spending into custom categories</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size={18} /> New Category
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
          <p>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-card empty-state">
          <Tag size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No categories created yet</p>
          <span>Click "+ New Category" to create your first category.</span>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          {categories.map((cat) => {
            const catColor = cat.color || '#8b5cf6';
            return (
              <div
                key={cat.id}
                className="glass-card"
                style={{
                  position: 'relative',
                  borderTop: `4px solid ${catColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: catColor,
                        boxShadow: `0 0 10px ${catColor}`,
                      }}
                    />
                    <h4 style={{ margin: 0, wordBreak: 'break-word' }}>{cat.name}</h4>
                  </div>
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    title="Delete Category"
                    style={{ marginLeft: '0.5rem', flexShrink: 0 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${catColor}22`,
                      color: catColor,
                      border: `1px solid ${catColor}55`,
                      fontSize: '0.75rem',
                    }}
                  >
                    {catColor}
                  </span>
                  {cat.transactionCount !== undefined && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {cat.transactionCount} transactions
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Category Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Category</h3>
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
                <label className="form-label" htmlFor="cat-name">Category Name</label>
                <input
                  id="cat-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Groceries, Entertainment, Rent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={submitting}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cat-color">Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input
                    id="cat-color"
                    type="color"
                    className="form-control"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={submitting}
                    style={{ width: '60px', padding: '0.2rem' }}
                  />
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{color}</span>
                </div>

                {/* Preset quick colors */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: color === c ? '2px solid #ffffff' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: color === c ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                        transition: 'transform 0.15s ease',
                      }}
                      title={c}
                    />
                  ))}
                </div>
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
                      <span className="spinner-sm" /> Creating...
                    </>
                  ) : (
                    'Create Category'
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
