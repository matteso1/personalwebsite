// src/pages/Contact.jsx
import React, { useState, useEffect } from 'react';
import { FaSpotify, FaInstagram, FaTwitter, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

// Section Title Component
const SectionTitle = ({ children, className = '' }) => (
  <h2 className={`text-2xl md:text-3xl font-heading font-bold text-white mb-6 ${className}`}>
    {children}
  </h2>
);

// Social Link Component
const SocialLink = ({ icon, platform, username, href }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-accent/30 transition-all group"
  >
    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-accent/20 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-white font-medium">{platform}</p>
      <p className="text-white/70 group-hover:text-accent transition-colors">{username}</p>
    </div>
  </a>
);

// Form Input Component
const FormInput = ({ label, type, placeholder, value, onChange, required = false }) => (
  <div className="mb-6">
    <label className="block text-white/80 mb-2 text-sm">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-accent/50 focus:outline-none transition-colors text-white"
    />
  </div>
);

// Form Textarea Component
const FormTextarea = ({ label, placeholder, value, onChange, required = false }) => (
  <div className="mb-6">
    <label className="block text-white/80 mb-2 text-sm">{label}</label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={5}
      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-accent/50 focus:outline-none transition-colors text-white resize-none"
    ></textarea>
  </div>
);

// Main Contact Component
const Contact = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className={`min-h-screen bg-dark py-20 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Get in <span className="text-accent">Touch</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            I'd love to hear from you! Whether you're interested in collaborations, 
            have questions about my music, or just want to say hello.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
            <SectionTitle>Send a Message</SectionTitle>
            
            {submitSuccess ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-white">
                <p className="font-medium">Thank you for your message!</p>
                <p className="text-white/80 text-sm mt-1">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Your Name"
                  type="text"
                  placeholder="Enter your name"
                  value={formState.name}
                  onChange={handleChange}
                  name="name"
                  required
                />
                
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={formState.email}
                  onChange={handleChange}
                  name="email"
                  required
                />
                
                <FormInput
                  label="Subject"
                  type="text"
                  placeholder="What's this about?"
                  value={formState.subject}
                  onChange={handleChange}
                  name="subject"
                />
                
                <FormTextarea
                  label="Your Message"
                  placeholder="Write your message here..."
                  value={formState.message}
                  onChange={handleChange}
                  name="message"
                  required
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all ${
                    isSubmitting
                      ? 'bg-accent/50 cursor-not-allowed'
                      : 'bg-accent hover:bg-accent/90'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaPaperPlane className="mr-2" /> Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* Connect Section */}
          <div>
            <SectionTitle>Connect With Me</SectionTitle>
            
            <div className="space-y-4 mb-10">
              <SocialLink
                icon={<FaInstagram className="text-white" size={20} />}
                platform="Instagram"
                username="@yoitsnils"
                href="https://instagram.com/yoitsnils"
              />
              
              <SocialLink
                icon={<FaSpotify className="text-white" size={20} />}
                platform="Spotify"
                username="Nils Matteson"
                href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo"
              />
              
              <SocialLink
                icon={<FaTwitter className="text-white" size={20} />}
                platform="Twitter"
                username="@nilsmatteson"
                href="https://twitter.com/"
              />
              
              <SocialLink
                icon={<FaEnvelope className="text-white" size={20} />}
                platform="Email"
                username="sendbeats2nils@gmail.com"
                href="mailto:sendbeats2nils@gmail.com"
              />
            </div>
            
            {/* FAQ Section */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-heading font-bold text-white mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium">Do you accept collaborations?</h4>
                  <p className="text-white/70 text-sm mt-1">Yes! I'm always open to collaborating with other artists and producers.</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium">How can I license your music?</h4>
                  <p className="text-white/70 text-sm mt-1">Please reach out via email for all licensing inquiries.</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium">Do you perform live?</h4>
                  <p className="text-white/70 text-sm mt-1">Yes, I'm available for live performances. Contact me for booking information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;