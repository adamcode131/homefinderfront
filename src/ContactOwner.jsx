export default function ContactOwner() {
  return (
    <div className="min-w-[400px] bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
        Contact Us
      </h2>
      
      <form className="space-y-6">
        {/* Object Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">
            Subject
          </label>
          <input
            type="text"
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
            rows={5}
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
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg
                     hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 transition-all duration-200
                     font-medium text-sm shadow-sm hover:shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}