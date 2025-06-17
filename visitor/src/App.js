import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestList from './components/GuestList';
import GuestForm from './components/GuestForm';
import GuestShow from './components/GuestShow';
import 'react-phone-input-2/lib/style.css';


// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// API service functions
const apiService = {
  // Add new visitor
  addVisitor: async (visitorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding visitor:', error);
      throw error;
    }
  },

  // Get all visitors
  getVisitors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visitors`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching visitors:', error);
      throw error;
    }
  },

  // Checkout visitor
  checkoutVisitor: async (idNumber, outTime) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visitors/${idNumber}/checkout`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outTime }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      throw error;
    }
  }
};

function App() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch guests on component mount
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getVisitors();
      if (response.success) {
        setGuests(response.data);
      }
    } catch (err) {
      setError('Failed to fetch guests');
      console.error('Error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (guestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.addVisitor(guestData);
      if (response.success) {
        // Refresh the guest list
        await fetchGuests();
        return { success: true, message: 'Guest added successfully!' };
      }
    } catch (err) {
      setError('Failed to add guest');
      console.error('Error adding guest:', err);
      return { success: false, message: 'Failed to add guest. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const getISTTime = () => {
    return new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCheckoutGuest = async (idNumber) => {
    setLoading(true);
    setError(null);
    try {
      const outTime = getISTTime()
      const response = await apiService.checkoutVisitor(idNumber, outTime);
      if (response.success) {
        // Refresh the guest list
        await fetchGuests();
        return { success: true, message: 'Guest checked out successfully!' };
      }
    } catch (err) {
      setError('Failed to checkout guest');
      console.error('Error checking out guest:', err);
      return { success: false, message: 'Failed to checkout guest. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App" style={{ padding: 0, margin: 0 }}>
        <img src="/header.png" alt="Header" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
        {error && (
          <div style={{ color: 'red', padding: '10px', background: '#fee' }}>
            {error}
          </div>
        )}
        {loading && (
          <div style={{ padding: '10px', background: '#eef' }}>
            Loading...
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <GuestList
                guests={guests}
                onCheckout={handleCheckoutGuest}
                onRefresh={fetchGuests}
              />
            }
          />
          <Route
            path="/add"
            element={
              <GuestForm
                onAddGuest={handleAddGuest}
              />
            }
          />
          <Route
            path="/show/:id"
            element={
              <GuestShow
                guests={guests}
              />
            }
          />
        </Routes>
        <img src="/footer.png" alt="Footer" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </Router>
  );
}

export default App;