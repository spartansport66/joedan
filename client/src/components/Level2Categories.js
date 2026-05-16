import React, { useState, useEffect } from 'react';
import { getSubcategoriesLevel2, getAllSubcategoriesLevel1, createSubcategoryLevel2, updateSubcategoryLevel2, deleteSubcategoryLevel2 } from '../api';
import './Level2Categories.css';

function Level2Categories() {
  const [level1Items, setLevel1Items] = useState([]);
  const [level2Items, setLevel2Items] = useState([]);
  const [selectedLevel1, setSelectedLevel1] = useState('');
  const [form, setForm] = useState({ name: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevel1Items();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedLevel1) {
      loadLevel2Items();
    }
  }, [selectedLevel1]);

  const loadLevel1Items = async () => {
    try {
      setLoading(true);
      const res = await getAllSubcategoriesLevel1();
      setLevel1Items(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedLevel1(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load level 1 items', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLevel2Items = async () => {
    try {
      const res = await getSubcategoriesLevel2(selectedLevel1);
      setLevel2Items(res.data || []);
    } catch (err) {
      console.error('Failed to load level 2 items', err);
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
        await updateSubcategoryLevel2(editingId, form);
      } else {
        await createSubcategoryLevel2({
          level1_id: selectedLevel1,
          ...form
        });
      }
      setForm({ name: '', image: '' });
      setEditingId(null);
      loadLevel2Items();
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
        await deleteSubcategoryLevel2(id);
        loadLevel2Items();
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
  if (level1Items.length === 0) return <div className="empty-state">No Level 1 categories found. Create them first!</div>;

  return (
    <div className="level2-categories">
      <h3>Level 2 Subcategories (Sub of Sub Category)</h3>

      <div className="category-selector">
        <label>Select Parent (Level 1):</label>
        <select value={selectedLevel1} onChange={(e) => setSelectedLevel1(e.target.value)}>
          {level1Items.map((item) => (
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
        {level2Items.length === 0 ? (
          <p>No items found. Create one!</p>
        ) : (
          level2Items.map((item) => (
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

export default Level2Categories;
