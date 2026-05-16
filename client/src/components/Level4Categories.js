import React, { useState, useEffect } from 'react';
import { getSubcategoriesLevel4, getAllSubcategoriesLevel3, createSubcategoryLevel4, updateSubcategoryLevel4, deleteSubcategoryLevel4 } from '../api';
import './Level4Categories.css';

function Level4Categories() {
  const [level3Items, setLevel3Items] = useState([]);
  const [level4Items, setLevel4Items] = useState([]);
  const [selectedLevel3, setSelectedLevel3] = useState('');
  const [form, setForm] = useState({ name: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevel3Items();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedLevel3) {
      loadLevel4Items();
    }
  }, [selectedLevel3]);

  const loadLevel3Items = async () => {
    try {
      setLoading(true);
      const res = await getAllSubcategoriesLevel3();
      setLevel3Items(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedLevel3(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load level 3 items', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLevel4Items = async () => {
    try {
      const res = await getSubcategoriesLevel4(selectedLevel3);
      setLevel4Items(res.data || []);
    } catch (err) {
      console.error('Failed to load level 4 items', err);
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
        await updateSubcategoryLevel4(editingId, form);
      } else {
        await createSubcategoryLevel4({
          level3_id: selectedLevel3,
          ...form
        });
      }
      setForm({ name: '', image: '' });
      setEditingId(null);
      loadLevel4Items();
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
        await deleteSubcategoryLevel4(id);
        loadLevel4Items();
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
  if (level3Items.length === 0) return <div className="empty-state">No Level 3 categories found. Create them first!</div>;

  return (
    <div className="level4-categories">
      <h3>Level 4 Subcategories (Sub of Sub of Sub of Sub Category)</h3>

      <div className="category-selector">
        <label>Select Parent (Level 3):</label>
        <select value={selectedLevel3} onChange={(e) => setSelectedLevel3(e.target.value)}>
          {level3Items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
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
        {level4Items.length === 0 ? (
          <p>No items found. Create one!</p>
        ) : (
          level4Items.map((item) => (
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

export default Level4Categories;
