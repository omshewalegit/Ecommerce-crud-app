import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

const API = "http://localhost:8080/api";
const UNSPLASH_KEY = "8h5cz0wV-je9A0JpYQ3FED5XqaJJf5zlm7jJyOsH0ts";
const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Books",
  "Sports",
  "Beauty",
  "Home",
  "Toys",
  "Furniture",
  "Automotive",
  "Stationery",
  "Pets",
  "Travel",
  "Gaming",
  "Other",
];

const CAT_COLOR = {
  Electronics: "#00e5ff",
  Clothing: "#ff6b9d",
  Food: "#ffd166",
  Books: "#a78bfa",
  Sports: "#39d98a",
  Beauty: "#fb923c",
  Home: "#60a5fa",
  Other: "#8b949e",
};

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  category: "",
  brand: "",
  imageUrl: "",
  available: true,
};

// ─── TOAST ──────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── BADGE ──────────────────────────────────────────────────────
function AvailBadge({ available }) {
  return (
    <span className={`badge ${available ? "badge-avail" : "badge-unavail"}`}>
      {available ? "● Live" : "○ Off"}
    </span>
  );
}

function CatBadge({ category }) {
  const color = CAT_COLOR[category] || CAT_COLOR["Other"];
  return (
    <span
      className="badge"
      style={{ color, borderColor: color + "44", background: color + "18" }}
    >
      {category || "Uncategorized"}
    </span>
  );
}

// ─── UNSPLASH IMAGE PICKER ───────────────────────────────────────
function UnsplashPicker({ query, onSelect, onClose }) {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const search = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12&orientation=squarish`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } },
      );
      if (!res.ok) throw new Error("Unsplash API error");
      const data = await res.json();
      setImages(data.results || []);
      if ((data.results || []).length === 0)
        setError("No images found. Try a different search.");
    } catch {
      setError("Could not load images. Check your Unsplash API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) search(query);
    // eslint-disable-next-line
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search(searchQuery);
  };

  return (
    <div
      className="unsplash-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="unsplash-panel">
        <div className="unsplash-header">
          <span className="unsplash-title">Pick an Image</span>
          <button className="modal-close" onClick={onClose}></button>
        </div>
        <div className="unsplash-search-row">
          <input
            ref={inputRef}
            className="input"
            placeholder="Search Unsplash (e.g. laptop, sneakers…)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => search(searchQuery)}
            disabled={loading}
            style={{ whiteSpace: "nowrap" }}
          >
            {loading ? "…" : "Search"}
          </button>
        </div>

        {error && <div className="unsplash-error">{error}</div>}

        {loading ? (
          <div className="loading-wrap" style={{ minHeight: 180 }}>
            <div className="spinner" />
            <span>Searching Unsplash…</span>
          </div>
        ) : (
          <div className="unsplash-grid">
            {images.map((img) => (
              <button
                key={img.id}
                className="unsplash-thumb"
                onClick={() => onSelect(img.urls.regular)}
                title={img.alt_description || img.description || "Photo"}
              >
                <img
                  src={img.urls.small}
                  alt={img.alt_description || ""}
                  loading="lazy"
                />
                <div className="unsplash-credit">{img.user?.name}</div>
              </button>
            ))}
          </div>
        )}

        {!loading && images.length === 0 && !error && (
          <div className="empty-state" style={{ minHeight: 160 }}>
            <div className="empty-glyph"></div>
            <div className="empty-title">Search for images above</div>
            <div className="empty-sub">Powered by Unsplash</div>
          </div>
        )}

        <div className="unsplash-footer">
          Photos by{" "}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer">
            Unsplash
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ────────────────────────────────────────────────
function ProductCard({ product, onEdit, onDelete, onView }) {
  return (
    <div className="product-card">
      {product.imageUrl ? (
        <img
          className="card-image"
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <div className="card-image-placeholder">
          <div className="card-ph-shape"></div>
        </div>
      )}
      <div className="card-body">
        <div className="card-top-row">
          <div className="card-name">{product.name}</div>
          <AvailBadge available={product.available} />
        </div>
        <div className="card-brand">
          {product.brand && <span>{product.brand} · </span>}
          <CatBadge category={product.category} />
        </div>
        {product.description && (
          <div className="card-desc">{product.description}</div>
        )}
        <div className="card-footer">
          <div>
            <div className="card-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>
            <div className="card-stock">Stock: {product.stockQuantity}</div>
          </div>
        </div>
        <div className="card-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onView(product)}
          >
            View
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(product)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT FORM MODAL ──────────────────────────────────────────
function ProductFormModal({
  mode,
  form,
  setForm,
  onClose,
  onSubmit,
  submitting,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const title = mode === "add" ? "Add Product" : "Edit Product";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageSelect = (url) => {
    setForm((f) => ({ ...f, imageUrl: url }));
    setShowPicker(false);
  };

  // Auto-suggest search query from product name or category
  const pickerQuery = form.name || form.category || "";

  return (
    <>
      <div
        className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">{title}</div>
            <button className="modal-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group col-2">
                <label className="form-label">Product Name *</label>
                <input
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  className="input"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Qty</label>
                <input
                  className="input"
                  name="stockQuantity"
                  type="number"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  className="input"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Apple"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="select input"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── IMAGE URL + PICKER ── */}
              <div className="form-group col-2">
                <label className="form-label">Product Image</label>
                <div className="image-field-row">
                  <input
                    className="input"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="Paste a URL or search Unsplash →"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm unsplash-btn"
                    onClick={() => setShowPicker(true)}
                    title="Search Unsplash for an image"
                  >
                    Search
                  </button>
                </div>
                {form.imageUrl && (
                  <div className="image-preview-row">
                    <img
                      className="image-preview-thumb"
                      src={form.imageUrl}
                      alt="preview"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ marginLeft: 8 }}
                      onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group col-2">
                <label className="form-label">Description</label>
                <textarea
                  className="input form-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short product description..."
                />
              </div>
              <div className="form-group col-2">
                <label className="form-label">Availability</label>
                <div className="toggle-row">
                  <button
                    type="button"
                    className={`toggle-switch ${form.available ? "on" : ""}`}
                    onClick={() =>
                      setForm((f) => ({ ...f, available: !f.available }))
                    }
                  />
                  <span className="toggle-label">
                    {form.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button
                className="btn btn-primary btn-full"
                onClick={onSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Saving…"
                  : mode === "add"
                    ? "+ Add Product"
                    : "Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPicker && (
        <UnsplashPicker
          query={pickerQuery}
          onSelect={handleImageSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

// ─── DETAIL MODAL ────────────────────────────────────────────────
function DetailModal({ product, onClose, onEdit, onDelete }) {
  if (!product) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Product Details</div>
          <button className="modal-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {product.imageUrl ? (
            <img
              className="detail-hero"
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="detail-hero-placeholder">
              <div className="card-ph-shape"></div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <AvailBadge available={product.available} />
            <CatBadge category={product.category} />
          </div>
          <div className="detail-name">{product.name}</div>
          {product.description && (
            <div className="detail-desc">{product.description}</div>
          )}
          <div className="detail-grid">
            <div className="detail-field">
              <div className="detail-key">Price</div>
              <div className="detail-val price">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-key">Stock</div>
              <div className="detail-val">{product.stockQuantity} units</div>
            </div>
            <div className="detail-field">
              <div className="detail-key">Brand</div>
              <div className="detail-val">{product.brand || "—"}</div>
            </div>
            <div className="detail-field">
              <div className="detail-key">ID</div>
              <div
                className="detail-val"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}
              >
                #{product.id}
              </div>
            </div>
          </div>
          {(product.createdAt || product.updatedAt) && (
            <div className="detail-ts">
              {product.createdAt && <span>Created: {product.createdAt}</span>}
              {product.updatedAt && <span>Updated: {product.updatedAt}</span>}
            </div>
          )}
          <div
            className="form-actions"
            style={{
              marginTop: "1.25rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                onClose();
                onEdit(product);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              style={{ flex: 1 }}
              onClick={() => {
                onClose();
                onDelete(product);
              }}
            >
              Delete
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRM DELETE MODAL ─────────────────────────────────────────
function ConfirmModal({ product, onClose, onConfirm, submitting }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal modal-sm">
        <div className="modal-header">
          <div className="modal-title">Delete Product</div>
          <button className="modal-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p className="confirm-text">
            Are you sure you want to delete{" "}
            <span className="confirm-name">"{product?.name}"</span>? This action
            cannot be undone.
          </p>
          <div
            className="form-actions"
            style={{ margin: 0, padding: 0, border: "none" }}
          >
            <button
              className="btn btn-danger btn-full"
              onClick={onConfirm}
              disabled={submitting}
            >
              {submitting ? "Deleting…" : "Yes, Delete"}
            </button>
            <button className="btn btn-ghost btn-full" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [navView, setNavView] = useState("products");

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterAvail, setFilterAvail] = useState("");

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const toast = (msg, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      toast(
        "Could not reach backend. Make sure Spring Boot is running on :8080",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal("add");
  };
  const openEdit = (p) => {
    setSelected(p);
    setForm({
      ...p,
      price: String(p.price ?? ""),
      stockQuantity: String(p.stockQuantity ?? ""),
    });
    setModal("edit");
  };
  const openDetail = (p) => {
    setSelected(p);
    setModal("detail");
  };
  const openDelete = (p) => {
    setSelected(p);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast("Product name is required.", "error");
    if (!form.price) return toast("Price is required.", "error");

    const body = {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity) || 0,
    };

    if (modal === "add") {
      delete body.id;
      delete body.createdAt;
      delete body.updatedAt;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/product`, {
        method: modal === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast(
        modal === "add" ? "Product added successfully!" : "Product updated!",
        "success",
      );
      closeModal();
      fetchProducts();
    } catch {
      toast("Operation failed. Check console.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/products/${selected.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast("Product deleted.", "success");
      closeModal();
      fetchProducts();
    } catch {
      toast("Delete failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const totalValue = products.reduce(
    (s, p) => s + (Number(p.price) || 0) * (p.stockQuantity || 0),
    0,
  );
  const availCount = products.filter((p) => p.available).length;
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const ok1 =
      !q ||
      [p.name, p.brand, p.category, p.description].some((s) =>
        s?.toLowerCase().includes(q),
      );
    const ok2 = !filterCat || p.category === filterCat;
    const ok3 =
      !filterAvail || (filterAvail === "yes" ? p.available : !p.available);
    return ok1 && ok2 && ok3;
  });

  return (
    <div className="app-shell">
      <ToastContainer toasts={toasts} />

      <header className="app-header">
        <div className="logo">
          <div className="logo-mark"></div>
          <div className="logo-copy">
            <span className="logo-name">NEXUS</span>
            <span className="logo-edition">STORE</span>
          </div>
        </div>
        <div className="header-actions">
          <div className="header-stat">
            <span className="header-stat-dot live"></span>
            <strong>{products.length}</strong> products
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Product
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-section-label">Menu</div>
          <button
            className={`nav-item ${navView === "products" ? "active" : ""}`}
            onClick={() => setNavView("products")}
          >
            <span className="nav-icon nav-icon-grid"></span>Products
            <span className="nav-badge">{products.length}</span>
          </button>
          <button
            className={`nav-item ${navView === "dashboard" ? "active" : ""}`}
            onClick={() => setNavView("dashboard")}
          >
            <span className="nav-icon nav-icon-chart"></span>Dashboard
          </button>

          {categories.length > 0 && (
            <>
              <div className="sidebar-section-label">Categories</div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`nav-item ${filterCat === cat && navView === "products" ? "active" : ""}`}
                  onClick={() => {
                    setFilterCat(filterCat === cat ? "" : cat);
                    setNavView("products");
                  }}
                >
                  <span className="nav-icon"></span>
                  {cat}
                  <span className="nav-badge">
                    {products.filter((p) => p.category === cat).length}
                  </span>
                </button>
              ))}
            </>
          )}
        </aside>

        <main className="main-content">
          {navView === "dashboard" && (
            <>
              <div className="page-head">
                <div>
                  <div className="page-title">Dashboard</div>
                  <div className="page-subtitle">Inventory at a glance</div>
                </div>
              </div>
              <div className="stats-row">
                <div className="stat-card s-cyan">
                  <div className="stat-ico">
                    <div className="stat-ico-inner"></div>
                  </div>
                  <div className="stat-value">{products.length}</div>
                  <div className="stat-label">Total Products</div>
                </div>
                <div className="stat-card s-green">
                  <div className="stat-ico">
                    <div className="stat-ico-inner"></div>
                  </div>
                  <div className="stat-value">{availCount}</div>
                  <div className="stat-label">Available</div>
                </div>
                <div className="stat-card s-red">
                  <div className="stat-ico">
                    <div className="stat-ico-inner"></div>
                  </div>
                  <div className="stat-value">
                    {products.length - availCount}
                  </div>
                  <div className="stat-label">Unavailable</div>
                </div>
                <div className="stat-card s-amber">
                  <div className="stat-ico">
                    <div className="stat-ico-inner"></div>
                  </div>
                  <div className="stat-value">
                    ₹
                    {totalValue >= 1e6
                      ? (totalValue / 1e6).toFixed(1) + "M"
                      : totalValue >= 1000
                        ? (totalValue / 1000).toFixed(1) + "K"
                        : totalValue.toFixed(0)}
                  </div>
                  <div className="stat-label">Inventory Value</div>
                </div>
                <div className="stat-card s-cyan">
                  <div className="stat-ico">
                    <div className="stat-ico-inner"></div>
                  </div>
                  <div className="stat-value">{categories.length}</div>
                  <div className="stat-label">Categories</div>
                </div>
                <div className="stat-card s-green">
                  <div className="stat-ico">
                    <div className="stat-ico-inner"></div>
                  </div>
                  <div className="stat-value">
                    {products.reduce((s, p) => s + (p.stockQuantity || 0), 0)}
                  </div>
                  <div className="stat-label">Total Stock</div>
                </div>
              </div>

              {categories.length > 0 && (
                <>
                  <div className="page-head" style={{ marginBottom: "1rem" }}>
                    <div>
                      <div
                        className="page-title"
                        style={{ fontSize: "1.2rem" }}
                      >
                        By Category
                      </div>
                    </div>
                  </div>
                  <div className="product-grid">
                    {categories.map((cat) => {
                      const catProds = products.filter(
                        (p) => p.category === cat,
                      );
                      const catVal = catProds.reduce(
                        (s, p) =>
                          s + (Number(p.price) || 0) * (p.stockQuantity || 0),
                        0,
                      );
                      const color = CAT_COLOR[cat] || "#8b949e";
                      return (
                        <div
                          key={cat}
                          className="stat-card"
                          style={{
                            borderColor: color + "30",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setFilterCat(cat);
                            setNavView("products");
                          }}
                        >
                          <div className="stat-ico">
                            <div className="stat-ico-inner"></div>
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              color,
                            }}
                          >
                            {catProds.length}
                          </div>
                          <div className="stat-label">{cat}</div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.72rem",
                              color: "var(--text2)",
                            }}
                          >
                            ₹{catVal.toLocaleString("en-IN")} value
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {navView === "products" && (
            <>
              <div className="page-head">
                <div>
                  <div className="page-title">Products</div>
                  <div className="page-subtitle">
                    {filtered.length} of {products.length} showing
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={fetchProducts}
                >
                  ↻ Refresh
                </button>
              </div>

              <div className="toolbar">
                <div className="search-box">
                  <span className="search-icon">
                    <div className="search-icon-circle"></div>
                    <div className="search-icon-handle"></div>
                  </span>
                  <input
                    className="input search-input"
                    placeholder="Search by name, brand, category…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="select"
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  className="select"
                  value={filterAvail}
                  onChange={(e) => setFilterAvail(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="yes">Available</option>
                  <option value="no">Unavailable</option>
                </select>
                {(filterCat || filterAvail || search) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setSearch("");
                      setFilterCat("");
                      setFilterAvail("");
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {loading ? (
                <div className="loading-wrap">
                  <div className="spinner" />
                  <span>Loading products…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-glyph"></div>
                  <div className="empty-title">
                    {products.length === 0
                      ? "No products yet"
                      : "No results found"}
                  </div>
                  <div className="empty-sub">
                    {products.length === 0
                      ? "Add your first product to get started"
                      : "Try adjusting your filters or search"}
                  </div>
                </div>
              ) : (
                <div className="product-grid">
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onView={openDetail}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {(modal === "add" || modal === "edit") && (
        <ProductFormModal
          mode={modal}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
      {modal === "detail" && (
        <DetailModal
          product={selected}
          onClose={closeModal}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}
      {modal === "delete" && (
        <ConfirmModal
          product={selected}
          onClose={closeModal}
          onConfirm={handleDelete}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default App;
