import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import './Newsletter.css';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await api.post('/subscribers/subscribe', { email });
      toast.success(response.data.message || "Subscribed successfully!");
      setEmail('');
    } catch (err: unknown) {
      const errorMsg = (err as any).response?.data?.detail || "Subscription failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <motion.div 
            className="newsletter-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="newsletter-icon">
              <Mail size={40} />
            </div>
            <h2 className="newsletter-title">Join The Inner Circle</h2>
            <p className="newsletter-desc">
              Subscribe to get exclusive grooming tips, style updates, and priority booking alerts directly to your inbox.
            </p>
            
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="input-group-premium">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <button type="submit" className="newsletter-btn" disabled={loading}>
                  {loading ? <Loader2 size={20} className="spinning-icon" /> : <><Send size={18} /> Subscribe</>}
                </button>
              </div>
            </form>
            <p className="newsletter-fineprint">We respect your privacy. Unsubscribe at any time.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
