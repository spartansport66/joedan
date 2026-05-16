import React, { useState, useEffect } from 'react';
import {
  getProducts,
  getProductCharacteristics,
  createProductCharacteristic,
  updateProductCharacteristic,
  deleteProductCharacteristic,
} from '../api';
import './ProductCharacteristics.css';

function ProductCharacteristics() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [characteristics, setCharacteristics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    unit: '',
    icon: '',
    display_order: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const loadCharacteristics = async (productId) => {
    if (!productId) {
      setCharacteristics([]);
      return;
    }

    try {
      setLoading(true);
      const res = await getProductCharacteristics(productId);
      setCharacteristics(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load characteristics');
      setCharacteristics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    setEditingId(null);
    setFormData({
      name: '',
      value: '',
      unit: '',
      icon: '',
      display_order: 0,
    });
    loadCharacteristics(productId);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) : value,
    }));
  };

  const handleAdd = async () => {
    if (!selectedProductId || !formData.name || !formData.value) {
      setError('Product, Name, and Value are required');
      return;
    }

    try {
      await createProductCharacteristic({
        product_id: selectedProductId,
        name: formData.name,
        value: formData.value,
        unit: formData.unit || null,
        icon: formData.icon || null,
        display_order: formData.display_order,
      });

      setSuccess('Characteristic added successfully!');
      setFormData({
        name: '',
        value: '',
        unit: '',
        icon: '',
        display_order: 0,
      });
      loadCharacteristics(selectedProductId);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to add characteristic');
    }
  };

  const handleEdit = (char) => {
    setEditingId(char.id);
    setFormData({
      name: char.name,
      value: char.value,
      unit: char.unit || '',
      icon: char.icon || '',
      display_order: char.display_order || 0,
    });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.value) {
      setError('Name and Value are required');
      return;
    }

    try {
      await updateProductCharacteristic(editingId, {
        name: formData.name,
        value: formData.value,
        unit: formData.unit || null,
        icon: formData.icon || null,
        display_order: formData.display_order,
      });

      setSuccess('Characteristic updated successfully!');
      setEditingId(null);
      setFormData({
        name: '',
        value: '',
        unit: '',
        icon: '',
        display_order: 0,
      });
      loadCharacteristics(selectedProductId);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update characteristic');
    }
  };

  const handleDelete = async (charId) => {
    if (!window.confirm('Are you sure you want to delete this characteristic?')) return;

    try {
      await deleteProductCharacteristic(charId);
      setSuccess('Characteristic deleted successfully!');
      loadCharacteristics(selectedProductId);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to delete characteristic');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      value: '',
      unit: '',
      icon: '',
      display_order: 0,
    });
    setError('');
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="product-characteristics-admin">
      <h2>Product Characteristics</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Product Selection */}
      <div className="form-group">
        <label>Select Product</label>
        <select
          value={selectedProductId}
          onChange={(e) => handleProductSelect(e.target.value)}
          className="form-select"
        >
          <option value="">-- Choose a product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProductId && (
        <>
          {/* Add/Edit Form */}
          <div className="characteristics-form">
            <h3>{editingId ? 'Edit Characteristic' : 'Add New Characteristic'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Characteristic Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g., Thermal transmittance"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Value *</label>
                <input
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleFormChange}
                  placeholder="e.g., ≤ 0.10"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleFormChange}
                  placeholder="e.g., W/m²K"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Icon (emoji or symbol)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleFormChange}
                  placeholder="e.g., ⚙️"
                  maxLength="2"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleFormChange}
                className="form-input"
                min="0"
              />
            </div>

            <div className="form-actions">
              {editingId ? (
                <>
                  <button onClick={handleUpdate} className="btn btn-primary">
                    Update Characteristic
                  </button>
                  <button onClick={handleCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleAdd} className="btn btn-primary">
                  Add Characteristic
                </button>
              )}
            </div>
          </div>

          {/* Characteristics List */}
          {loading ? (
            <p>Loading characteristics...</p>
          ) : characteristics.length > 0 ? (
            <div className="characteristics-list">
              <h3>Characteristics for: {selectedProduct?.name}</h3>
              <div className="characteristics-table">
                {characteristics.map((char) => (
                  <div key={char.id} className="characteristic-row">
                    <div className="char-info">
                      <div className="char-header">
                        {char.icon && <span className="char-icon">{char.icon}</span>}
                        <strong>{char.name}</strong>
                      </div>
                      <div className="char-details">
                        <span>{char.value}</span>
                        {char.unit && <span className="char-unit">{char.unit}</span>}
                      </div>
                    </div>
                    <div className="char-actions">
                      <button
                        onClick={() => handleEdit(char)}
                        className="btn btn-small btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(char.id)}
                        className="btn btn-small btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-data">No characteristics for this product yet</p>
          )}
        </>
      )}
    </div>
  );
}

export default ProductCharacteristics;
