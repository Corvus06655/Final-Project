import { useState } from "react";

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="page-wrapper">
      <div className="page">
        <span className="page-tag">// Get in Touch</span>
        <h1>Let's Talk<br />Inventory</h1>

        <div className="contact-wrapper">
          <div className="contact-info">
            <h3>We'd love to hear from you</h3>
            <p>Have a question about the platform or want a demo? Reach out and our team will get back to you within 24 hours.</p>

            <div className="contact-detail">
              <span className="contact-detail-icon">📍</span>
              <span>New Delhi, India</span>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon">📧</span>
              <span>hello@predictivesys.ai</span>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon">📞</span>
              <span>+91 98765 43210</span>
            </div>
          </div>

          <div className="contact-form-box">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@company.com" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="Tell us about your inventory challenges..." required></textarea>
              </div>
              <button type="submit" className="btn-submit">
                {sent ? "✓ Message Sent!" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
