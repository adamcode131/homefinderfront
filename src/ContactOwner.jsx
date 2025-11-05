import { useState } from "react";

export default function ContactOwner() {
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/send-contact-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          to_email: "adammrizeq131@gmail.com"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      setSuccess(true);
      setFormData({ subject: "", message: "" });
      
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Minimal Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-envelope text-primary text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-600 text-lg">We're here to help with any questions</p>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <i className="fa-solid fa-check-circle"></i>
                <span className="font-medium">Message sent successfully!</span>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 text-red-700">
                <i className="fa-solid fa-exclamation-circle"></i>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                           transition-all duration-200 bg-white
                           placeholder:text-gray-400 text-gray-900"
                placeholder="What is this regarding?"
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                           transition-all duration-200 bg-white resize-none
                           placeholder:text-gray-400 text-gray-900"
                placeholder="Please describe your inquiry in detail..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl 
                         hover:bg-blue-600 transition-all duration-300 
                         font-medium shadow-soft hover:shadow-card-hover
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Send Message</span>
                </div>
              )}
            </button>
          </form>

          {/* Minimal Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              <i className="fa-solid fa-clock mr-1"></i>
              Typically respond within 24 hours
            </p>
          </div>
        </div>

        {/* Simple Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need immediate help?{" "}
            <span className="text-primary font-medium">contact@example.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}