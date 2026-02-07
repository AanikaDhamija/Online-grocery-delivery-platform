import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, Eye, Pen, Trash2, AlertTriangle, CheckCircle, Package, 
    XCircle, Plus, UploadCloud, DollarSign, BarChart, Tag, FileText, Truck 
} from 'lucide-react';
import './ProductsPage.css';
import Spinner from '../COMPONENTS/Spinner';

// --- Mock Data Simulation ---
const allProductsData = [
  { id: 1, name: 'Organic Bananas', unit: 'bunch', category: 'fruits', price: 3.50, stock: 45, supplier: 'Green Valley Farms', status: 'Active', image: 'https://placehold.co/100x100/FBBF24/FFFFFF?text=🍌' },
  { id: 2, name: 'Fresh Milk', unit: 'liter', category: 'dairy', price: 4.25, stock: 8, supplier: 'Dairy Fresh Co.', status: 'Active', image: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=🥛' },
  { id: 3, name: 'Premium Steak', unit: 'piece', category: 'meat', price: 28.50, stock: 12, supplier: 'Prime Meat Suppliers', status: 'Active', image: 'https://placehold.co/100x100/EF4444/FFFFFF?text=🥩' },
  { id: 4, name: 'Whole Grain Bread', unit: 'loaf', category: 'bakery', price: 5.75, stock: 25, supplier: 'Artisan Bakery', status: 'Active', image: 'https://placehold.co/100x100/9333EA/FFFFFF?text=🍞' },
  { id: 5, name: 'Fresh Spinach', unit: 'bunch', category: 'vegetables', price: 2.85, stock: 5, supplier: 'Green Valley Farms', status: 'Active', image: 'https://placehold.co/100x100/22C55E/FFFFFF?text=🥬' },
];
// --- End Mock Data ---


// --- Add/Edit Product Modal Component ---
const ProductFormModal = ({ isOpen, onClose, onSave, product }) => {
  const isEditing = !!product;
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setFormData(product);
        setImagePreview(product.image || null);
      } else {
        setFormData({ name: '', unit: '', category: 'fruits', price: '', stock: '', supplier: '', status: 'Active' });
        setImagePreview(null);
      }
    }
  }, [isOpen, product, isEditing]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        image: imagePreview || `https://placehold.co/100x100/CCCCCC/FFFFFF?text=${formData.name.charAt(0)}`
    };
    onSave(finalData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="close-btn"><XCircle size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="image-upload-area">
              <label>Product Image</label>
              <div className="image-preview" onClick={() => document.getElementById('fileInput').click()}>
                {imagePreview ? <img src={imagePreview} alt="Product Preview" /> : (
                  <div className="upload-placeholder">
                    <UploadCloud size={40} />
                    <span>Click to upload</span>
                    <span className="upload-hint">PNG, JPG up to 10MB</span>
                  </div>
                )}
              </div>
              <input type="file" id="fileInput" onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>
            <div className="form-fields">
              <div className="form-group full-width">
                <label htmlFor="name">Product Name</label>
                <div className="input-wrapper">
                  <Package size={16} className="input-icon" />
                  <input type="text" id="name" name="name" value={formData.name || ''} placeholder="e.g., Organic Apples" required onChange={handleChange} />
                </div>
              </div>
              {/* ... other form fields ... */}
              <div className="form-group">
                    <label htmlFor="unit">Unit</label>
                    <div className="input-wrapper">
                        <FileText size={16} className="input-icon" />
                        <input type="text" id="unit" name="unit" value={formData.unit || ''} placeholder="e.g., kg, bunch" onChange={handleChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <div className="input-wrapper">
                        <Tag size={16} className="input-icon" />
                        <select id="category" name="category" value={formData.category || 'fruits'} onChange={handleChange}>
                          <option value="fruits">Fruits</option>
                          <option value="vegetables">Vegetables</option>
                          <option value="dairy">Dairy</option>
                          <option value="meat">Meat</option>
                          <option value="bakery">Bakery</option>
                          <option value="beverages">Beverages</option>
                          <option value="frozen">Frozen</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <div className="input-wrapper">
                        {/* Replace DollarSign with ₹ symbol */}
                        <span className="input-icon" style={{fontWeight: 'bold', fontSize: 16, color: '#111827'}}>₹</span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price || ''}
                            placeholder="0.00"
                            required
                            min="0"
                            step="0.01"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                 <div className="form-group full-width">
                    <label htmlFor="supplier">Supplier Name</label>
                    <div className="input-wrapper">
                        <Truck size={16} className="input-icon" />
                        <input type="text" id="supplier" name="supplier" value={formData.supplier || ''} placeholder="e.g., Fresh Farms Inc." onChange={handleChange} />
                    </div>
                </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Save Changes' : <><Plus size={18} /> Add Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- View Product Modal (UPDATED) ---
const ViewProductModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Product Details</h2>
                    <button onClick={onClose} className="close-btn"><XCircle size={24} /></button>
                </div>
                <div className="modal-body">
                    <div className="view-image-container">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="view-details">
                        <h3>{product.name}</h3>
                        <p className="detail-item"><strong>Unit:</strong> {product.unit}</p>
                        <p className="detail-item"><strong>Category:</strong> <span className={`category-badge ${product.category}`}>{product.category}</span></p>
                        <p className="detail-item"><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
                        <p className="detail-item"><strong>Stock:</strong> {product.stock}</p>
                        <p className="detail-item"><strong>Supplier:</strong> {product.supplier}</p>
                        {/* Status detail item has been removed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Delete Confirmation Modal ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
                <div className="delete-modal-icon">
                    <AlertTriangle size={48} color="#D97706" />
                </div>
                <h3>Delete Product</h3>
                <p>Are you sure you want to delete "{productName}"? This action cannot be undone.</p>
                <div className="delete-modal-actions">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onConfirm} className="btn-danger">Delete</button>
                </div>
            </div>
        </div>
    );
};


const ProductMetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="product-metric-card">
    <div className="product-metric-card-info">
      <p className="value">{value}</p>
      <p className="label">{title}</p>
    </div>
    <div className={`product-metric-card-icon ${color}`}>
      <Icon size={20} />
    </div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    const loadProducts = () => {
      setTimeout(() => {
        setProducts(allProductsData);
        setLoading(false);
      }, 1000);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.supplier && p.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (stockFilter !== "all") {
        if (stockFilter === 'low') filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
        if (stockFilter === 'out') filtered = filtered.filter(p => p.stock === 0);
    }
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, stockFilter]);

  // --- CRUD Handlers ---
  const handleSaveProduct = (productData) => {
    if (productData.id) { // Editing existing product
        setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else { // Adding new product
        setProducts([{ ...productData, id: Date.now() }, ...products]);
    }
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  // --- Modal Open/Close Handlers ---
  const openAddModal = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };
  
  const openViewModal = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  if (loading) return <Spinner />;

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const activeProductsCount = products.filter(p => p.status === 'Active').length;

  return (
    <div className="products-page">
      <ProductFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={selectedProduct}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        productName={selectedProduct?.name}
      />

      <div className="products-header">
        <div className="products-header-title">
          <h1>Products Management</h1>
          <p>Manage your product catalog and inventory</p>
        </div>
        <button className="add-product-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      <div className="product-metrics-grid">
        <ProductMetricCard title="Total Products" value={products.length} icon={Package} color="total" />
        <ProductMetricCard title="Low Stock" value={lowStockCount} icon={AlertTriangle} color="low-stock" />
        <ProductMetricCard title="Out of Stock" value={outOfStockCount} icon={XCircle} color="out-of-stock" />
        <ProductMetricCard title="Active Products" value={activeProductsCount} icon={CheckCircle} color="active" />
      </div>

      <div className="card filter-card">
        {/* Filter controls remain the same */}
        <div className="card-header">
          <h3 className="filter-card-title"><Filter size={20} /> Filter Products</h3>
        </div>
        <div className="filter-controls">
          <div className="filter-search-input">
            <Search />
            <input
              type="text"
              placeholder="Search by product name or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select-trigger" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
            <option value="bakery">Bakery</option>
            <option value="vegetables">Vegetables</option>
            <option value="beverages">Beverages</option>
          </select>
          <select className="filter-select-trigger" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="card orders-table-card">
        <div className="table-wrapper">
          <table className="orders-table products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Supplier</th>
                {/* Status column removed */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-image-cell">
                        <img 
                            src={product.image || `https://placehold.co/100x100/CCCCCC/FFFFFF?text=${product.name.charAt(0)}`} 
                            alt={product.name} 
                            className="product-image-thumbnail"
                            onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/100x100/CCCCCC/FFFFFF?text=${product.name.charAt(0)}`; }}
                        />
                        <div className="product-info">
                            <p className="name">{product.name}</p>
                            <p className="unit">{product.unit}</p>
                        </div>
                    </div>
                  </td>
                  <td><span className={`category-badge ${product.category}`}>{product.category}</span></td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td className={`stock-cell ${product.stock < 10 && product.stock > 0 ? 'low-stock' : ''}`}>
                    {product.stock}
                    {product.stock < 10 && product.stock > 0 && <AlertTriangle size={14} />}
                  </td>
                  <td>{product.supplier}</td>
                  {/* Status cell removed */}
                  <td>
                    <div className="table-actions">
                      <button title="View" onClick={() => openViewModal(product)}><Eye size={18} /></button>
                      <button title="Edit" onClick={() => openEditModal(product)}><Pen size={18} /></button>
                      <button title="Delete" onClick={() => openDeleteModal(product)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}