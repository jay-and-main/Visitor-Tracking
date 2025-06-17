import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GuestList = ({ guests, onCheckout, onRefresh }) => {
  const [n, setN] = useState(0);

  // Placeholder: fetching previous day visitors — not wired into main guest list now
  const fetchVisitors = async (days) => {
    try {
      const response = await fetch(`http://localhost:3001/api/visitors/recent/${days}`);
      if (!response.ok) {
        console.error('Failed to fetch visitors:', response.statusText);
        return [];
      }
      const text = await response.text();
      console.log('Raw response:', text);
      const data = JSON.parse(text);
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
      return [];
    }
  };

  const loadPreviousDayVisitors = async () => {
    const previousDayVisitors = await fetchVisitors(n + 1);
    alert(`Loaded ${previousDayVisitors.length} guests from day ${n + 1}`);
    setN(prev => prev + 1);
    // To fully integrate, lift this to App state and merge there
  };

  const handleCheckout = async (idNumber) => {
    if (window.confirm('Are you sure you want to check out this guest?')) {
      const result = await onCheckout(idNumber);
      alert(result.message);
    }
  };

  const visitingGuests = guests.filter(guest => !guest.outTime);
  const checkedOutGuests = guests.filter(guest => guest.outTime);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Guest List</h2>
        <div>
          <Link
            to="/add"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 15px',
              textDecoration: 'none',
              borderRadius: '4px',
              marginRight: '10px'
            }}
          >
            Add New Guest
          </Link>
          <button
            onClick={onRefresh}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', color: '#28a745' }}>Visiting</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {visitingGuests.map((guest, index) => (
            <div
              key={`${guest.idNumber}-${index}`}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#e8f5e9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <strong>Name:</strong> {guest.name}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Company:</strong> {guest.company}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>ID Number:</strong> {guest.idNumber}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Date:</strong> {guest.date}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>In Time:</strong> {guest.inTime}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleCheckout(guest.idNumber)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '8px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Check Out
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '20px', color: '#dc3545' }}>Checked Out</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {checkedOutGuests.map((guest, index) => (
            <div
              key={`${guest.idNumber}-${index}`}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <strong>Name:</strong> {guest.name}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Company:</strong> {guest.company}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>ID Number:</strong> {guest.idNumber}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Date:</strong> {guest.date}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>In Time:</strong> {guest.inTime}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Out Time:</strong> {guest.outTime}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={loadPreviousDayVisitors}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Load Previous Day
      </button>
    </div>
  );
};

export default GuestList;
