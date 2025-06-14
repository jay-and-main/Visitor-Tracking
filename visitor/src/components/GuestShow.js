// components/GuestShow.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const GuestShow = ({ guests }) => {
  const { id } = useParams();
  const guest = guests.find(g => g.idNumber === id);

  if (!guest) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Guest Not Found</h2>
        <Link to="/">Back to Guest List</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Guest Details</h2>
     
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>Date:</strong> {guest.date}
        </div>
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
          <strong>In Time:</strong> {guest.inTime}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Purpose:</strong> {guest.purpose}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Out Time:</strong> {guest.outTime || 'Not checked out'}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Approval Person:</strong> {guest.approvalPerson}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Contact:</strong> {guest.contact}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Status:</strong>
          <span style={{
            marginLeft: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: guest.status === 'Checked In' ? '#d4edda' : '#f8d7da',
            color: guest.status === 'Checked In' ? '#155724' : '#721c24'
          }}>
            {guest.status}
          </span>
        </div>
      </div>

      <Link
        to="/"
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Back to Guest List
      </Link>
    </div>
  );
};

export default GuestShow;