import axios from "axios";
import { useState } from "react";

const Payment = ({ isOpen, onClose, packageName, points, price }) => {
  const [amount, setAmount] = useState(price); // Pre-fill with package price

const handleSubmit = (e) => {
  e.preventDefault() ; 
  console.log('Amount:', amount);
  console.log('Points:', points);

  axios.post(
    'http://localhost:8000/api/payment',
    { amount: amount, points: points , status : 'pending' },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
  .then((response) => {
    response.status === 200
      ? alert('Payment successful!')
      : alert('Payment failed!');
  })
  .catch(() => {
    alert('Payment failed!');
  });
};


  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 relative">
          <h1 className="text-2xl font-bold text-center">Bank Transfer</h1>
          <p className="text-blue-100 text-center mt-2">
            {packageName && `Package: ${packageName} - ${points} points`}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Bank Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-lg px-4 py-3 font-bold text-xl">
                CIH
              </div>
              <p className="text-gray-600 text-sm mt-1">BANK</p>
            </div>
          </div>
        </div>

        {/* Account Number */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Account Number</p>
            <p className="text-gray-800 font-mono text-lg tracking-wider">
              230 780320669321100330067
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-3">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold">DH</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
              {packageName && (
                <p className="text-sm text-gray-500 mt-2">
                  Package price: {price} DH
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Submit Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;