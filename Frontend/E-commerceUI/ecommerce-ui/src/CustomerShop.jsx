import { useState, useEffect, useCallback, useRef } from "react";
import "./CustomerShop.css";

const API = "http://localhost:8080/api";

const CAT_EMOJI = {
  Electronics: "",
  Clothing: "",
  Food: "",
  Books: "",
  Sports: "",
  Beauty: "",
  Home: "",
  Toys: "",
  Furniture: "",
  Automotive: "",
  Stationery: "",
  Pets: "",
  Travel: "",
  Gaming: "",
  Other: "",
};

// ─── TOAST ───────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="cs-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`cs-toast cs-toast-${t.type}`}>
          <span className="cs-toast-dot"></span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── PRODUCT DETAIL MODAL ─────────────────────────────────────────
function ProductDetail({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  return (
    <div
      className="cs-detail-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cs-detail-modal">
        <button className="cs-detail-close" onClick={onClose}></button>

        <div className="cs-detail-img-wrap">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="cs-detail-img"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="cs-detail-img-ph"
            style={{ display: product.imageUrl ? "none" : "flex" }}
          >
            <div className="cs-detail-ph-icon"></div>
          </div>
          {!product.available && (
            <div className="cs-detail-oos-badge">Out of Stock</div>
          )}
        </div>

        <div className="cs-detail-body">
          <div className="cs-detail-meta">
            <span className="cs-cat-pill">
              {CAT_EMOJI[product.category] || "📦"} {product.category}
            </span>
            {product.brand && (
              <span className="cs-brand-pill">{product.brand}</span>
            )}
          </div>

          <h2 className="cs-detail-name">{product.name}</h2>

          {product.description && (
            <p className="cs-detail-desc">{product.description}</p>
          )}

          <div className="cs-detail-price-row">
            <span className="cs-detail-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span className="cs-detail-stock">
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : "Out of stock"}
            </span>
          </div>

          {product.available && product.stockQuantity > 0 && (
            <div className="cs-detail-actions">
              <div className="cs-qty-control">
                <button
                  className="cs-qty-btn minus"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                ></button>
                <span className="cs-qty-val">{qty}</span>
                <button
                  className="cs-qty-btn plus"
                  onClick={() =>
                    setQty((q) => Math.min(product.stockQuantity, q + 1))
                  }
                ></button>
              </div>
              <button
                className="cs-add-btn cs-add-btn-full"
                onClick={() => {
                  onAddToCart(product, qty);
                  onClose();
                }}
              >
                Add to Cart — ₹
                {(Number(product.price) * qty).toLocaleString("en-IN")}
              </button>
            </div>
          )}

          {(!product.available || product.stockQuantity === 0) && (
            <div className="cs-oos-msg">
              This product is currently unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CART SIDEBAR ─────────────────────────────────────────────────
function CartSidebar({ cart, open, onClose, onRemove, onChangeQty, onClear }) {
  const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <div
        className={`cs-cart-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />
      <aside className={`cs-cart-sidebar ${open ? "open" : ""}`}>
        <div className="cs-cart-hdr">
          <div className="cs-cart-title">
            <div className="cs-cart-ico"></div>
            Your Cart
            {totalItems > 0 && (
              <span className="cs-cart-count">{totalItems}</span>
            )}
          </div>
          <button className="cs-cart-close" onClick={onClose}></button>
        </div>

        {cart.length === 0 ? (
          <div className="cs-cart-empty">
            <div className="cs-cart-empty-glyph"></div>
            <div className="cs-cart-empty-title">Cart is empty</div>
            <div className="cs-cart-empty-sub">
              Add some products to get started
            </div>
          </div>
        ) : (
          <>
            <div className="cs-cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cs-cart-item">
                  {/* ── FIXED: was cs-cart-item-img, now cs-cart-item-thumb ── */}
                  <div className="cs-cart-item-thumb">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="cs-cart-item-ph" />
                    )}
                  </div>
                  <div className="cs-cart-item-info">
                    <div className="cs-cart-item-name">{item.name}</div>
                    <div className="cs-cart-item-brand">
                      {item.brand || item.category}
                    </div>
                    <div className="cs-cart-item-price">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="cs-cart-item-right">
                    <div className="cs-qty-mini">
                      <button
                        className="cs-qty-btn minus"
                        onClick={() => onChangeQty(item.id, item.qty - 1)}
                      ></button>
                      <span>{item.qty}</span>
                      <button
                        className="cs-qty-btn plus"
                        onClick={() => onChangeQty(item.id, item.qty + 1)}
                      ></button>
                    </div>
                    <div className="cs-cart-item-total">
                      ₹{(Number(item.price) * item.qty).toLocaleString("en-IN")}
                    </div>
                    <button
                      className="cs-cart-remove"
                      onClick={() => onRemove(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cs-cart-footer">
              <div className="cs-cart-summary">
                <div className="cs-cart-summary-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="cs-cart-summary-row cs-cart-summary-total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button className="cs-checkout-btn">
                Proceed to Checkout
                <span className="cs-checkout-arrow"></span>
              </button>
              <button className="cs-clear-btn" onClick={onClear}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────
function ProductCard({ product, onView, onAddToCart, addedId }) {
  const isAdded = addedId === product.id;

  return (
    <div className="cs-card" onClick={() => onView(product)}>
      <div className="cs-card-img-wrap">
        {product.imageUrl ? (
          <img
            className="cs-card-img"
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="cs-card-ph"
          style={{ display: product.imageUrl ? "none" : "flex" }}
        >
          <div className="cs-card-ph-icon"></div>
        </div>
        {!product.available && <div className="cs-oos-tag">Out of Stock</div>}
        <div className="cs-card-category">{product.category}</div>
      </div>

      <div className="cs-card-body">
        <div className="cs-card-name">{product.name}</div>
        {product.brand && <div className="cs-card-brand">{product.brand}</div>}
        {product.description && (
          <div className="cs-card-desc">{product.description}</div>
        )}
        <div className="cs-card-foot">
          <div className="cs-card-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>
          <button
            className={`cs-add-btn cs-add-btn-card ${isAdded ? "added" : ""} ${!product.available ? "disabled" : ""}`}
            disabled={!product.available}
            onClick={(e) => {
              e.stopPropagation();
              if (product.available) onAddToCart(product, 1);
            }}
          >
            {isAdded ? (
              "✓ Added"
            ) : (
              <>
                <div className="cs-add-ico"></div> Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN CUSTOMER SHOP ───────────────────────────────────────────
export default function CustomerShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterAvail, setFilterAvail] = useState("yes");
  const [detailProduct, setDetailProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cs_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const searchRef = useRef(null);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cs_cart", JSON.stringify(cart));
  }, [cart]);

  const toast = (msg, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      toast("Could not load products. Try again.", "err");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Dynamic categories from DB
  const allCategories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // Filtered products
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const ok1 =
      !q ||
      [p.name, p.brand, p.category, p.description].some((s) =>
        s?.toLowerCase().includes(q),
      );
    const ok2 = !filterCat || p.category === filterCat;
    const ok3 =
      filterAvail === "yes"
        ? p.available
        : filterAvail === "no"
          ? !p.available
          : true;
    return ok1 && ok2 && ok3;
  });

  // Cart actions
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { ...product, qty }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    toast(`${product.name} added to cart`, "ok");
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const changeQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => {
    setCart([]);
    toast("Cart cleared", "info");
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="cs-shell">
      <Toast toasts={toasts} />

      {/* ── HEADER ── */}
      <header className="cs-header">
        <div className="cs-logo">
          <div className="cs-logo-mark">NX</div>
          <span className="cs-logo-text">
            NEXUS<em>STORE</em>
          </span>
        </div>

        <div className="cs-search-hero">
          <div className="cs-search-pre">
            <div className="cs-search-ico"></div>
            <div className="cs-search-divider-v"></div>
            <div className="cs-search-cmd"></div>
          </div>
          <input
            ref={searchRef}
            className="cs-search-inp"
            placeholder="Search products, brands, categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="cs-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <button className="cs-cart-btn" onClick={() => setCartOpen(true)}>
          <div className="cs-cart-ico"></div>
          Cart
          {totalItems > 0 && (
            <span className="cs-cart-badge">{totalItems}</span>
          )}
        </button>
      </header>

      {/* ── FILTERS BAR ── */}
      <div className="cs-filters-bar">
        <div className="cs-filters-inner">
          <button
            className={`cs-cat-btn ${filterCat === "" ? "active" : ""}`}
            onClick={() => setFilterCat("")}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`cs-cat-btn ${filterCat === cat ? "active" : ""}`}
              onClick={() => setFilterCat(filterCat === cat ? "" : cat)}
            >
              {CAT_EMOJI[cat] || "📦"} {cat}
            </button>
          ))}
          <div className="cs-filters-divider" />
          <select
            className="cs-avail-sel"
            value={filterAvail}
            onChange={(e) => setFilterAvail(e.target.value)}
          >
            <option value="yes">In Stock</option>
            <option value="">All Items</option>
            <option value="no">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* ── RESULTS INFO ── */}
      <div className="cs-results-bar">
        <span className="cs-results-count">
          {loading
            ? "Loading…"
            : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
          {(search || filterCat) && (
            <span className="cs-results-for">
              {search && ` for "${search}"`}
              {filterCat && ` in ${filterCat}`}
            </span>
          )}
        </span>
        {(search || filterCat || filterAvail !== "yes") && (
          <button
            className="cs-clear-filters"
            onClick={() => {
              setSearch("");
              setFilterCat("");
              setFilterAvail("yes");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── MAIN GRID ── */}
      <main className="cs-main">
        {loading ? (
          <div className="cs-loading">
            <div className="cs-spinner" />
            <span>Loading products…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="cs-empty">
            <div className="cs-empty-ico">🔍</div>
            <div className="cs-empty-title">No products found</div>
            <div className="cs-empty-sub">Try a different search or filter</div>
          </div>
        ) : (
          <div className="cs-grid">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={setDetailProduct}
                onAddToCart={addToCart}
                addedId={addedId}
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── PRODUCT DETAIL ── */}
      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* ── CART SIDEBAR ── */}
      <CartSidebar
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onChangeQty={changeQty}
        onClear={clearCart}
      />
    </div>
  );
}
