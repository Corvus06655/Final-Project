function Home() {
  return (
    <div className="home">
      <h1>Predictive Inventory Management System</h1>
      <p>AI-based system to predict stock demand.</p>
      <button>Get Started</button>
      <div className="features">
        <div className="card">
          <h3>📊 Prediction</h3>
          <p>Forecast future demand</p>
        </div>
        <div className="card">
          <h3>⚡ Real-time</h3>
          <p>Live inventory tracking</p>
        </div>
        <div className="card">
          <h3>💰 Savings</h3>
          <p>Reduce cost & wastage</p>
        </div>
      </div>
    </div>
  );
}

export default Home;