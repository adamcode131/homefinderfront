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
          to_email: "adammrizeq131@gmail.com" // Target email address
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      setSuccess(true);
      setFormData({ subject: "", message: "" });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[400px] bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
        Contact Us
      </h2>
      
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          Message sent successfully!
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-blue-200 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200 outline-none
                       placeholder:text-blue-300 text-blue-900"
            placeholder="What is this regarding?"
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-blue-200 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200 outline-none resize-none
                       placeholder:text-blue-300 text-blue-900"
            placeholder="Type your message here..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg
                     hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 transition-all duration-200
                     font-medium text-sm shadow-sm hover:shadow-md
                     disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}