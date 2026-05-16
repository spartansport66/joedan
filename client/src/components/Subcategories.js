import React, { useState, useEffect } from 'react';
import { getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, getCategories } from '../api';
import './Subcategories.css';

function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', image: '', category_id: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subRes, catRes] = await Promise.all([getSubcategories(), getCategories()]);
      setSubcategories(subRes.data);
      setCategories(catRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSubcategory(editingId, form);
      } else {
        await createSubcategory(form);
      }
      setForm({ name: '', image: '', category_id: '' });
      setEditingId(null);
      loadData();
    } catch (err) {
      setError('Failed to save subcategory');
      console.error(err);
    }
  };

  const handleEdit = (subcategory) => {
    setEditingId(subcategory.id);
    setForm({
      name: subcategory.name,
      image: subcategory.image || '',
      category_id: subcategory.category_id,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subcategory?')) {
      try {
        await deleteSubcategory(id);
        loadData();
      } catch (err) {
        setError('Failed to delete subcategory');
        console.error(err);
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  return (
    <div className="subcategories-container">
      <h2>Subcategories</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Subcategory name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Subcategory</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', image: '', category_id: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list">
          {subcategories.map((subcategory) => (
            <div key={subcategory.id} className="item">
              {subcategory.image && <img src={subcategory.image} alt={subcategory.name} />}
              <div className="item-info">
                <h3>{subcategory.name}</h3>
                <p>{getCategoryName(subcategory.category_id)}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(subcategory)}>Edit</button>
                <button onClick={() => handleDelete(subcategory.id)} className="delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Subcategories;
