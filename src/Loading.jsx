// Loading.jsx
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <div className="text-xl font-bold text-blue-600 flex items-center">
                <i className="fa-solid fa-home mr-2"></i>
                HomeFinder
              </div>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="w-full h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-16 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Loading Content */}
      <main className="pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {/* Animated Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-8"
            />
            
            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Searching for your perfect home...
              </h2>
              <p className="text-gray-600">
                Our AI is analyzing your preferences to find the best matches
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-full max-w-md bg-gray-200 rounded-full h-2 mt-8"
            >
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </motion.div>

            {/* Loading Dots */}
            <motion.div className="flex space-x-2 mt-6">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}