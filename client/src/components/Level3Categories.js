import React, { useState, useEffect } from 'react';
import { getSubcategoriesLevel3, getSubcategoriesLevel2, createSubcategoryLevel3, updateSubcategoryLevel3, deleteSubcategoryLevel3 } from '../api';
import './Level3Categories.css';

function Level3Categories() {
  const [level2Items, setLevel2Items] = useState([]);
  const [level3Items, setLevel3Items] = useState([]);
  const [selectedLevel2, setSelectedLevel2] = useState('');
  const [form, setForm] = useState({ name: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevel2Items();
  }, []);

  useEffect(() => {
    if (selectedLevel2) {
      loadLevel3Items();
    }
  }, [selectedLevel2]);

  const loadLevel2Items = async () => {
    try {
      setLoading(true);
      const res = await getSubcategoriesLevel2(null);
      setLevel2Items(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedLevel2(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load level 2 items', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLevel3Items = async () => {
    try {
      const res = await getSubcategoriesLevel3(selectedLevel2);
      setLevel3Items(res.data || []);
    } catch (err) {
      console.error('Failed to load level 3 items', err);
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
        await updateSubcategoryLevel3(editingId, form);
      } else {
        await createSubcategoryLevel3({
          level2_id: selectedLevel2,
          ...form
        });
      }
      setForm({ name: '', image: '' });
      setEditingId(null);
      loadLevel3Items();
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
        await deleteSubcategoryLevel3(id);
        loadLevel3Items();
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
  if (level2Items.length === 0) return <div className="empty-state">No Level 2 categories found. Create them first!</div>;

  return (
    <div className="level3-categories">
      <h3>Level 3 Subcategories (Sub of Sub of Sub Category)</h3>

      <div className="category-selector">
        <label>Select Parent (Level 2):</label>
        <select value={selectedLevel2} onChange={(e) => setSelectedLevel2(e.target.value)}>
          {level2Items.map((item) => (
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
        {level3Items.length === 0 ? (
          <p>No items found. Create one!</p>
        ) : (
          level3Items.map((item) => (
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

export default Level3Categories;
