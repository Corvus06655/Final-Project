import { useEffect, useRef } from "react";

function Home() {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-wrapper">
      <div className="home">
        <span className="hero-badge">AI-Powered Inventory Intelligence</span>

        <h1>Predict. Optimize.<br />Never Run Out.</h1>

        <p className="subtitle">
          An intelligent system that forecasts stock demand using real-time data analysis —
          so you always have exactly what you need.
        </p>

        <button className="btn-primary" onClick={scrollToFeatures}>
          Explore Features →
        </button>

        <div className="stats">
          <div className="stat">
            <span className="stat-num">98%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat">
            <span className="stat-num">3x</span>
            <span className="stat-label">Faster Restocking</span>
          </div>
          <div className="stat">
            <span className="stat-num">40%</span>
            <span className="stat-label">Cost Reduction</span>
          </div>
        </div>

        <div className="features" ref={featuresRef}>
          <div className="card">
            <span className="card-icon">📊</span>
            <h3>Demand Prediction</h3>
            <p>Forecast future inventory needs using ML models trained on your historical sales data.</p>
          </div>
          <div className="card">
            <span className="card-icon">⚡</span>
            <h3>Real-Time Tracking</h3>
            <p>Monitor live stock levels across all warehouses and trigger alerts automatically.</p>
          </div>
          <div className="card">
            <span className="card-icon">💰</span>
            <h3>Cost Savings</h3>
            <p>Minimize overstock and stockouts to cut carrying costs and lost revenue.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
