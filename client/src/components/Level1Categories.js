import React, { useState, useEffect } from 'react';
import { getSubcategoriesLevel1, createSubcategoryLevel1, updateSubcategoryLevel1, deleteSubcategoryLevel1, getCategories } from '../api';
import './Level1Categories.css';

function Level1Categories() {
  const [categories, setCategories] = useState([]);
  const [level1Categories, setLevel1Categories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({ name: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedCategory) {
      loadLevel1Categories();
    }
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const catRes = await getCategories();
      setCategories(catRes.data || []);
      if (catRes.data && catRes.data.length > 0) {
        setSelectedCategory(catRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLevel1Categories = async () => {
    try {
      const res = await getSubcategoriesLevel1(selectedCategory);
      setLevel1Categories(res.data || []);
    } catch (err) {
      console.error('Failed to load level 1 categories', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert('Name is required');
      return;
    }

    try {
      if (editingId) {
        await updateSubcategoryLevel1(editingId, form);
      } else {
        await createSubcategoryLevel1({
          category_id: selectedCategory,
          ...form
        });
      }
      setForm({ name: '', image: '' });
      setEditingId(null);
      loadLevel1Categories();
    } catch (err) {
      alert('Failed to save');
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, image: item.image || '' });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteSubcategoryLevel1(id);
        loadLevel1Categories();
      } catch (err) {
        alert('Failed to delete');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setForm({ name: '', image: '' });
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="level1-categories">
      <h3>Level 1 Subcategories (Sub of Category)</h3>

      <div className="category-selector">
        <label>Select Parent Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="Enter image URL (optional)"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="items-list">
        {level1Categories.length === 0 ? (
          <p>No items found. Create one!</p>
        ) : (
          level1Categories.map((item) => (
            <div key={item.id} className="item-card">
              {item.image && <img src={item.image} alt={item.name} className="item-image" />}
              <div className="item-info">
                <h4>{item.name}</h4>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)} className="btn-edit">
                  ✎ Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="btn-delete">
                  ✕ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Level1Categories;
