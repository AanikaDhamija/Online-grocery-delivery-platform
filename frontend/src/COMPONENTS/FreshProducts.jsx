import React, { useState, useEffect, memo } from "react";
import "../STYLES/FreshProducts.css";
import { useCart } from "./CartContext";

// Mock product data (simulating API response)
const productsData = [
  { id: 1, name: "Fresh Organic Apples 3pc", category: "Fruits", price: 120, oldPrice: 150, discount: "20% OFF", time: "10 mins", image: "/images/items/Apples.jpeg" },
  { id: 2, name: "Farm Fresh Bananas 4pc", category: "Fruits", price: 40, time: "12 mins", image: "/images/items/banana.jpeg" },
  { id: 3, name: "Organic Spinach", category: "Vegetables", price: 25, oldPrice: 30, discount: "17% OFF", time: "8 mins", image: "/images/items/Spinach.jpeg" },
  { id: 4, name: "Fresh Milk 1L", category: "Dairy", price: 60, time: "15 mins", image: "/images/items/Milk.webp" },
  { id: 5, name: "Red Bell Peppers", category: "Vegetables", price: 80, oldPrice: 95, discount: "16% OFF", time: "10 mins", image: "/images/items/Redbellpepper.webp" },
  { id: 6, name: "Yogurt", category: "Dairy", price: 50, time: "12 mins", image: "/images/items/Yogurt.jpeg" },
  { id: 7, name: "Mixed Nuts", category: "Snacks", price: 403, oldPrice: 480, discount: "16% OFF", time: "15 mins", image: "/images/items/Mixednuts.webp" },
  { id: 8, name: "Orange Juice 1L", category: "Beverages", price: 180, time: "10 mins", image: "/images/items/Juice.jpeg" },
  { id: 9, name: "Atta Bread", category: "Breads & Eggs", price: 45, time: "14 mins", image: "/images/items/Attabread.avif" },
  { id: 10, name: "Garlic Bread", category: "Breads & Eggs", price: 35, time: "14 mins", image: "/images/items/Garlicbread.avif" },
  { id: 11, name: "Red Bull 250ml", category: "Beverages", price: 125, time: "10 mins", image: "/images/items/Redbull.avif" },
  { id: 12, name: "Chicken Boneless 400g", category: "Meat", price: 160, time: "20 mins", image: "/images/items/Chicken.avif" },
  { id: 13, name: "Frozen Chicken 500g", category: "Meat", price: 260, oldPrice: 350, discount: "12% OFF", time: "25 mins", image: "/images/items/Frozenchicken.avif" },
  { id: 14, name: "Butter 100g", category: "Dairy", price: 62, time: "15 mins", image: "/images/items/Butter.avif" },
  { id: 15, name: "Strawberries 500g", category: "Fruits", price: 180, oldPrice: 200, discount: "10% OFF", time: "11 mins", image: "/images/items/Strawberries.webp" },
  { id: 16, name: "Oats 150g", category: "Snacks", price: 84, oldPrice: 100, discount: "16% OFF", time: "11 mins", image: "/images/items/Oats.avif" },
  { id: 17, name: "Onions 1kg", category: "Vegetables", price: 60, time: "9 mins", image: "/images/items/Onions.webp" },
  { id: 18, name: "Almond Cookies", category: "Sweets", price: 150, time: "13 mins", image: "/images/items/Almondcookies.webp" },
  { id: 19, name: "Protein Bar 40g", category: "Sweets", price: 36, oldPrice: 60, discount: "4% OFF", time: "10 mins", image: "/images/items/Proteinbar.avif" },
  { id: 20, name: "Paneer 200g", category: "Dairy", price: 95, time: "15 mins", image: "/images/items/Paneer.avif" },
  { id: 21, name: "Diced Cheese 200g", category: "Dairy", price: 120, time: "15 mins", image: "/images/items/Dicedcheese.avif" },
  { id: 22, name: "Poha 60g", category: "Snacks", price: 30, discount: "6% OFF", time: "10 mins", image: "/images/items/Poha.avif" },
  { id: 23, name: "Namkeen 210g", category: "Snacks", price: 60, time: "10 mins", image: "/images/items/Namkeen.avif" },
  { id: 24, name: "Doritos 60g", category: "Snacks", price: 30, time: "10 mins", image: "/images/items/Chips.avif" },
  { id: 25, name: "Popcorn 33g", category: "Snacks", price: 30, time: "14 mins", image: "/images/items/Popcorn.avif" },
  { id: 26, name: "Makhana 55g", category: "Snacks", price: 150, time: "12 mins", image: "/images/items/Makhana.avif" },
  { id: 27, name: "Kurkure 65g", category: "Snacks", price: 20, time: "12 mins", image: "/images/items/Kurkure.avif" },
  { id: 28, name: "Kurkure Schezwan 65g", category: "Snacks", price: 25, time: "12 mins", image: "/images/items/Kurkure2.avif" },
  { id: 29, name: "Lays Chips 55g", category: "Snacks", price: 30, time: "9 mins", image: "/images/items/Lays.avif" },
  { id: 30, name: "Maggi Noodles 140g", category: "Snacks", price: 30, time: "9 mins", image: "/images/items/Noodles.avif" },
  { id: 31, name: "Ferrero Rocher 200g", category: "Sweets", price: 600, oldPrice: 700, discount: "14% OFF", time: "10 mins", image: "/images/items/FerreroRocher.avif" },
  { id: 32, name: "Chocolata Syrup 1.3kg", category: "Sweets", price: 325, time: "8 mins", image: "/images/items/ChocolateSyrup.avif" },
  { id: 33, name: "Gems 23g", category: "Sweets", price: 20, time: "8 mins", image: "/images/items/Gems.avif" },
  { id: 34, name: "Eggs 10pcs", category: "Breads & Eggs", price: 150, time: "14 mins", image: "/images/items/Eggs.avif" },
  { id: 35, name: "Eggs 6pcs", category: "Breads & Eggs", price: 80, time: "10 mins", image: "/images/items/Eggs2.avif" },
  { id: 36, name: "Cold Coffee 170ml", category: "Beverages", price: 46, time: "10 mins", image: "/images/items/Coffee.avif" },
  { id: 37, name: "Packaged Water", category: "Beverages", price: 20, time: "8 mins", image: "/images/items/Water.avif" },
  { id: 38, name: "Coconut Water 1L", category: "Beverages", price: 99, oldPrice: 178, discount: "44% OFF", time: "9 mins", image: "/images/items/Coconutwater.avif" },
];

const FreshProductCard = memo(({ product }) => {
  const { cartItems, increment, decrement } = useCart();
  const cartItem = cartItems.find(i => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="product-card" role="listitem">
      <div className="product-image-container">
        {product.discount && <span className="discount-badge">{product.discount}</span>}
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <span className="delivery-time">⏱ {product.time}</span>
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
      </div>
      <div className="product-pricing">
        {product.oldPrice ? (
          <>
            <span className="current-price">₹{product.price}</span>
            <span className="old-price">₹{product.oldPrice}</span>
          </>
        ) : (
          <span className="current-price">₹{product.price}</span>
        )}
      </div>
      <div className="product-action">
        {quantity === 0 ? (
          <button onClick={() => increment(product)} className="add-button">ADD</button>
        ) : (
          <div className="quantity-selector">
            <button onClick={() => decrement(product.id)} className="quantity-btn">-</button>
            <span className="quantity-count">{quantity}</span>
            <button onClick={() => increment(product)} className="quantity-btn">+</button>
          </div>
        )}
      </div>
    </div>
  );
});

export default function FreshProducts({ selectedCategory, searchTerm }) {
  // CHANGED: This component no longer manages its own state for filters.
  // It relies entirely on the props coming from App.jsx.
  const [filteredList, setFilteredList] = useState(productsData);

  useEffect(() => {
    let results = productsData;

    // 1. Filter by the selected category from props
    if (selectedCategory && selectedCategory !== "All") {
      results = results.filter(p => p.category === selectedCategory);
    }

    // 2. Filter the result by the search term from props
    if (searchTerm && searchTerm.trim() !== "") {
      results = results.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredList(results);
    
  }, [selectedCategory, searchTerm]); // Effect re-runs when either prop changes

  const filteredProducts = productsData.filter(product => {
    if (searchTerm) {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (selectedCategory && selectedCategory !== "All") {
      return product.category === selectedCategory;
    }
    return true; // Show all products if no category or "All" is selected
  });

  return (
    <section id="fresh-products" className="fresh-products-section">
      <h2 className="fresh-products-title">
        {selectedCategory ? selectedCategory : "All Products"}
      </h2>
      <div className="fresh-products-divider"></div>
      
      {/* REMOVED: The redundant filter buttons are gone from here. */}
      
      <div className="product-grid">
        {filteredProducts.length > 0
          ? filteredProducts.map(product => <FreshProductCard key={product.id} product={product} />)
          : <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No products found</p>
        }
      </div>
    </section>
  );
}