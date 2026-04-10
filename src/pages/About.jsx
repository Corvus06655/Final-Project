function About() {
  return (
    <div className="page-wrapper">
      <div className="page">
        <span className="page-tag">// About the System</span>
        <h1>Built for Modern<br />Supply Chains</h1>
        <p>
          Our platform uses advanced data analysis and machine learning to predict
          inventory needs before shortages occur — keeping your business running smoothly.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>🧠 Machine Learning</h3>
            <p>Models trained on millions of data points to deliver accurate forecasts tailored to your business patterns and seasonality.</p>
          </div>
          <div className="about-card">
            <h3>📡 Live Data Feeds</h3>
            <p>Integrates with your existing POS and warehouse systems to track stock movements in real time, 24/7.</p>
          </div>
          <div className="about-card">
            <h3>📈 Analytics Dashboard</h3>
            <p>Visual reports and trend analysis give your team clear insight into demand cycles and supplier performance.</p>
          </div>
          <div className="about-card">
            <h3>🔒 Enterprise Security</h3>
            <p>End-to-end encryption and role-based access control to keep your business data safe and compliant.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
