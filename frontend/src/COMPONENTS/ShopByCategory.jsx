
import React from 'react';
import '../STYLES/ShopByCategory.css';

const categories = [
  { name: "Fruits", icon: "/images/categories/fruits.png" },
  { name: "Vegetables", icon: "/images/categories/vegetables.png" },
  { name: "Dairy", icon: "/images/categories/dairy.png" },
  { name: "Snacks", icon: "/images/categories/snacks.png" },
  { name: "Beverages", icon: "/images/categories/beverages.png" },
  { name: "Breads & Eggs", icon: "/images/categories/breads_eggs.png" },
  { name: "Meat", icon: "/images/categories/meat.png" },
  { name: "Sweets", icon: "/images/categories/sweets.png" },
];  


function CategoryCard({ category, onCategorySelect }) {
  return (
    <div className="category-card" onClick={() => onCategorySelect(category.name)}>
      <img
        src={category.icon}
        alt={category.name}
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/fefefe/333?text=No+Img"; }}
        className="category-card-image"
      />
      <p className="category-card-name">{category.name}</p>
    </div>
  );
}

export default function ShopByCategory({ onCategorySelect }) {
  return (
    <div className="shop-by-category-container">
      <div className="shop-by-category-inner">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} onCategorySelect={onCategorySelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
