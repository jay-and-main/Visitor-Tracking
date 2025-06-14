// components/GuestList.js
import React from 'react';
import { Link } from 'react-router-dom';

const GuestList = ({ guests, onCheckout, onRefresh }) => {
  const handleCheckout = async (idNumber) => {
    if (window.confirm('Are you sure you want to check out this guest?')) {
      const result = await onCheckout(idNumber);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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

      {guests.length === 0 ? (
        <p>No guests found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID Number</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>In Time</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Purpose</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Out Time</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{guest.date}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{guest.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{guest.company}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{guest.idNumber}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{guest.inTime}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{guest.purpose}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{guest.outTime || 'Not checked out'}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: guest.status === 'Checked In' ? '#d4edda' : '#f8d7da',
                      color: guest.status === 'Checked In' ? '#155724' : '#721c24'
                    }}>
                      {guest.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {guest.status === 'Checked In' && (
                      <button
                        onClick={() => handleCheckout(guest.idNumber)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GuestList;