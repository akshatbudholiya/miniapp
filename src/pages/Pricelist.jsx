import React, { useEffect, useState } from "react";
import {
  FaFileInvoice,
  FaUsers,
  FaBuilding,
  FaBookOpen,
  FaTag,
  FaFileInvoiceDollar,
  FaTimesCircle,
  FaMoneyBillWave,
  FaBoxes,
  FaUserAlt,
  FaExchangeAlt,
  FaSignOutAlt,
  FaArrowDown,
  FaArrowRight,
  FaSearch,
  FaPlusCircle,
  FaPrint,
  FaSyncAlt,
  FaBars,
} from "react-icons/fa";
import "./Pricelist.css";

const menuItems = [
  { name: "Menu", heading: true },
  { name: "Invoices", icon: <FaFileInvoice /> },
  { name: "Customers", icon: <FaUsers /> },
  { name: "My Business", icon: <FaBuilding /> },
  { name: "Invoice Journal", icon: <FaBookOpen /> },
  { name: "Price List", icon: <FaTag />, active: true },
  { name: "Multiple Invoicing", icon: <FaFileInvoiceDollar /> },
  { name: "Unpaid Invoices", icon: <FaTimesCircle />, red: true },
  { name: "Offer", icon: <FaMoneyBillWave /> },
  { name: "Inventory Control", icon: <FaBoxes />, disabled: true },
  { name: "Member Invoicing", icon: <FaUserAlt />, disabled: true },
  { name: "Import/Export", icon: <FaExchangeAlt /> },
  { name: "Log out", icon: <FaSignOutAlt />, bottom: true },
];

const mockItem = {
  id: 1,
  article_no: "1234567890",
  product_service: "This is a test product with fifty characters this!",
  in_price: "900500",
  price: "1500800",
  unit: "kilometers/hour",
  in_stock: "2500600",
  description: "This is the description with fifty characters this",
};

const Pricelist = () => {
  const [items, setItems] = useState([]);
  const [searchArticle, setSearchArticle] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPricelist();
  }, []);

  const fetchPricelist = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/pricelist");
      if (!response.ok) throw new Error("Failed to load pricelist");
      const data = await response.json();
      setItems(data && data.length > 0 ? data : [mockItem]);
    } catch (err) {
      setError(err.message);
      setItems([mockItem]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const articleMatch = item.article_no
      ?.toLowerCase()
      .includes(searchArticle.toLowerCase());
    const productMatch = item.product_service
      ?.toLowerCase()
      .includes(searchProduct.toLowerCase());
    return (
      (!searchArticle && !searchProduct) ||
      (searchArticle && articleMatch) ||
      (searchProduct && productMatch)
    );
  });

  const overlayClickHandler = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="full-app-container">
      <header className="app-header">
        <div className="header-left">
          <button
            className="hamburger-btn"
            aria-label="Toggle menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
          </button>

          <div className="user-info-header">
            <div className="user-avatar-wrapper">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="online-dot"></span>
            </div>
            <div className="user-texts">
              <div className="user-name">John Andre</div>
              <div className="user-company">Storfjord AS</div>
            </div>
          </div>
        </div>

        <div className="language-selector">
          Norsk Bokmål{" "}
          <img
            src="https://flagcdn.com/w40/no.png"
            alt="Norwegian Flag"
            className="flag-icon"
          />
        </div>
      </header>

      <div className="main-layout">
        <nav
          className={`sidebar-menu ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          {menuItems.map((item, i) =>
            item.heading ? (
              <div key={i} className="menu-heading">
                {item.name}
                <hr />
              </div>
            ) : (
              <div
                key={i}
                className={`menu-item ${
                  item.active ? "active-item" : ""
                } ${item.bottom ? "bottom-item" : ""} ${
                  item.disabled ? "disabled-item" : ""
                }`}
                title={item.disabled ? "Disabled" : ""}
                tabIndex={item.disabled ? -1 : 0}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span
                  className={`item-icon ${
                    item.red ? "red-icon" : item.active ? "green-icon" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="item-name">{item.name}</span>
              </div>
            )
          )}
        </nav>
        
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={overlayClickHandler}></div>
        )}

        <main className="pricelist-content-area">
          <div className="pricelist-actions-row">
            <div className="pricelist-search-group">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search Article No..."
                  value={searchArticle}
                  onChange={(e) => setSearchArticle(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search Product..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
            </div>

            <div className="pricelist-buttons-group">
              <button className="action-button new-product-button">
                New Product <FaPlusCircle className="btn-icon green" />
              </button>
              <button className="action-button print-list-button">
                Print List <FaPrint className="btn-icon blue" />
              </button>
              <button className="action-button advanced-mode-button">
                Advanced mode <FaSyncAlt className="btn-icon blue" />
              </button>
            </div>
          </div>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : error && filteredItems.length === 0 ? (
            <p className="error-text">Failed to load: {error}</p>
          ) : filteredItems.length > 0 ? (
            <div className="pricelist-table-wrapper">
              <div className="pricelist-table-header-row">
                <div className="header-item arrow-space"></div>
                <div className="header-item header-article">
                  Article No. <FaArrowDown className="header-arrow blue-arrow" />
                </div>
                <div className="header-item header-product">
                  Product/Service{" "}
                  <FaArrowDown className="header-arrow green-arrow" />
                </div>
                <div className="header-item numeric-col">In Price</div>
                <div className="header-item numeric-col">Price</div>
                <div className="header-item">Unit</div>
                <div className="header-item numeric-col">In Stock</div>
                <div className="header-item header-description">Description</div>
                <div className="header-item more-actions-col"></div>
              </div>

              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`pricelist-row ${idx === 0 ? "selected-row" : ""}`}
                >
                  <div className="arrow-icon">{idx === 0 && <FaArrowRight />}</div>
                  <div className="pricelist-pill article-pill">
                    {item.article_no}
                  </div>
                  <div className="pricelist-pill product-pill">
                    {item.product_service}
                  </div>
                  <div className="pricelist-pill numeric-col">{item.in_price}</div>
                  <div className="pricelist-pill numeric-col">{item.price}</div>
                  <div className="pricelist-pill unit-pill">{item.unit}</div>
                  <div className="pricelist-pill numeric-col">{item.in_stock}</div>
                  <div className="pricelist-pill description-pill">
                    {item.description}
                  </div>
                  <div className="more-actions-col">...</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">No matching items found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Pricelist;