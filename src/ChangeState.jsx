import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function ChangeState() {
  const [isValidated, setIsValidated] = useState(false);
  const [property, setProperty] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Initialize state from location
  useEffect(() => {
    if (location.state?.property) {
      setProperty(location.state.property);
      // Convert 1/0 to boolean for the toggle
      setIsValidated(location.state.property.is_validated === 1);
    }
  }, [location.state]);

  const toggleValidation = () => {
    const newValue = !isValidated;
    setIsValidated(newValue);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!property) return;

    setIsLoading(true);
    try {
      // Make API call to toggle the property validation status
      const response = await axios.get(
        `http://localhost:8000/api/setProperty/${property.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update local state with response data
      const updatedProperty = response.data.property;
      setProperty(updatedProperty);
      setIsValidated(updatedProperty.is_validated === 1);
      setHasChanges(false);
      
      // Show success message
      console.log('Update successful:', response.data);
      alert(`Property ${updatedProperty.is_validated === 1 ? 'validated' : 'rejected'} successfully!`);
      
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating validation status. Please try again.');
      
      // Revert the toggle on error
      setIsValidated(!isValidated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original state
    if (property) {
      setIsValidated(property.is_validated === 1);
    }
    setHasChanges(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 w-80 mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{property?.title || 'Property'}</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Toggle to change validation state</p>
        
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center">
            {isValidated ? (
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Validated</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Rejected</span>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleValidation}
            disabled={isLoading}
            className={`
              relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 shadow-inner disabled:opacity-50
              ${isValidated ? 'bg-green-400' : 'bg-red-400'}
            `}
          >
            <span
              className={`
                inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-500 ease-in-out
                ${isValidated ? 'translate-x-8' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        <div className={`text-xs px-3 py-1 rounded-full mb-4 text-center ${isValidated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isValidated ? '✓ Property is validated' : '✗ Property is rejected'}
        </div>

        {/* Save/Cancel buttons - Only show when there are changes */}
        {hasChanges && (
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}

        {/* Original status indicator */}
        {property && !hasChanges && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            Current status: {property.is_validated === 1 ? 'Validated' : 'Rejected'}
          </div>
        )}
      </div>
    </div>
  );
}