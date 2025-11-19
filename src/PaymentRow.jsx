import { useState } from 'react';

const PaymentRow = ({ payment, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(payment.status);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(payment.user || {});

  const handleStatusUpdate = async () => {
    if (status === payment.status) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Update payment status
      const paymentResponse = await fetch(`http://localhost:8000/api/payments/${payment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to update payment status');
      }

      // If status changed to completed, update user balance and send notification
      if (status === 'completed' && payment.status !== 'completed') {
        // Update user balance (add points)
        const balanceResponse = await fetch('http://localhost:8000/api/updateUserBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: payment.user_id,
            points: payment.points,
            action: 'add'
          })
        });

        if (!balanceResponse.ok) {
          throw new Error('Failed to update user balance');
        }

        const balanceData = await balanceResponse.json();
        setUserData(balanceData.user);

        // Send notification to user
        const notificationResponse = await fetch(`http://localhost:8000/api/addNotification/${payment.user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            added_points: payment.points,
            deducted_points: 0,
            message: `Your payment of ${payment.amount} DH for ${payment.points} points has been completed!`,
            type: 'payment_completed'
          })
        });

        if (!notificationResponse.ok) {
          console.warn('Failed to send notification, but payment was updated');
        }
      }

      // If status changed from completed to failed, optionally handle refund logic
      if (status === 'failed' && payment.status === 'completed') {
        // You can add refund logic here if needed
        const notificationResponse = await fetch(`http://localhost:8000/api/addNotification/${payment.user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            added_points: 0,
            deducted_points: 0,
            message: `Your payment of ${payment.amount} DH has failed. Please try again.`,
            type: 'payment_failed'
          })
        });
      }

      setIsEditing(false);
      onUpdate(); // Refresh the payments list
      
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStatus(payment.status);
    setIsEditing(false);
  };

  const getUserInitials = (user) => {
    if (!user?.name) return 'U';
    const names = user.name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="text-sm font-medium text-gray-900">
          {new Date(payment.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(payment.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {getUserInitials(userData)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {userData?.name || 'Unknown User'}
            </div>
            <div className="text-xs text-gray-500">
              Balance: {userData?.balance || 0} points
            </div>
            <div className="text-xs text-gray-400">
              ID: {payment.user_id}
            </div>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="text-lg font-semibold text-gray-900">
          {payment.amount} DH
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center">
          <i className="fa-solid fa-coins text-yellow-500 mr-2"></i>
          <span className="text-lg font-semibold text-gray-900">
            {payment.points}
          </span>
          <span className="text-sm text-gray-500 ml-1">points</span>
        </div>
      </td>
      
      <td className="py-4 px-6">
        {isEditing ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        ) : (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            payment.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : payment.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {payment.status === 'completed' && <i className="fa-solid fa-check-circle mr-1"></i>}
            {payment.status === 'pending' && <i className="fa-solid fa-clock mr-1"></i>}
            {payment.status === 'failed' && <i className="fa-solid fa-times-circle mr-1"></i>}
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
        )}
      </td>
      
      <td className="py-4 px-6">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleStatusUpdate}
              disabled={loading}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};

export default PaymentRow;