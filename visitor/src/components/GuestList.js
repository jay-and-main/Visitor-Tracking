import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CardHolder = ({ title, guests, onAction, actionLabel, actionColor }) => (
  <div style={{ marginBottom: '40px' }}>
    <h3 style={{ 
      marginBottom: '25px', 
      color: '#FF492C',
      fontSize: '22px',
      fontWeight: '600',
      fontFamily: 'Figtree, sans-serif'
    }}>
      {title}
    </h3>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
      gap: '20px' 
    }}>
      {guests.length === 0 ? (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          color: '#6c757d',
          fontFamily: 'Figtree, sans-serif',
          fontSize: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          No guests to display
        </div>
      ) : (
        guests.map((guest, index) => (
          <div
            key={`${guest.contact}-${index}`} // changed from guest.idNumber to guest.contact
            style={{
              border: '2px solid #FF492C',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Figtree, sans-serif',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ marginBottom: '12px', fontSize: '16px', color: '#062846' }}>
              <span style={{ fontWeight: '600', color: '#FF492C' }}>Name:</span> {guest.name}
            </div>
            <div style={{ marginBottom: '12px', fontSize: '16px', color: '#062846' }}>
              <span style={{ fontWeight: '600', color: '#FF492C' }}>Company:</span> {guest.company}
            </div>
            <div style={{ marginBottom: '12px', fontSize: '16px', color: '#062846' }}>
              <span style={{ fontWeight: '600', color: '#FF492C' }}>Date:</span> {guest.date}
            </div>
            <div style={{ marginBottom: '12px', fontSize: '16px', color: '#062846' }}>
              <span style={{ fontWeight: '600', color: '#FF492C' }}>In Time:</span> {guest.inTime}
            </div>
            {guest.outTime && (
              <div style={{ marginBottom: '12px', fontSize: '16px', color: '#062846' }}>
                <span style={{ fontWeight: '600', color: '#FF492C' }}>Out Time:</span> {guest.outTime}
              </div>
            )}
            <div style={{ marginBottom: '12px', fontSize: '16px', color: '#062846' }}>
              <span style={{ fontWeight: '600', color: '#FF492C' }}>Purpose:</span> {guest.purpose}
            </div>
            {onAction && (
              <button
                onClick={() => onAction(guest.contact)} // changed from guest.idNumber to guest.contact
                style={{
                  backgroundColor: actionColor,
                  color: '#ffffff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Figtree, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 2px 4px ${actionColor}30`
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {actionLabel}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

const GuestList = ({ guests, onCheckout }) => {
  const getISTDate = () => {
    return new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    });
  };

  const [selectedDate, setSelectedDate] = useState(getISTDate());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visitingGuests = filteredGuests.filter(guest => !guest.outTime);
  const checkedOutGuests = filteredGuests.filter(
    guest => guest.outTime && guest.date === selectedDate
  );

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Figtree, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h2 style={{ 
          color: '#FF492C',
          fontSize: '28px',
          fontWeight: '600',
          margin: '0',
          fontFamily: 'Figtree, sans-serif'
        }}>
          Guest Management System
        </h2>
        <Link
          to="/add"
          style={{
            backgroundColor: '#27D3BC',
            color: '#ffffff',
            padding: '12px 25px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontFamily: 'Figtree, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(39, 211, 188, 0.3)',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#23c0a5';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#27D3BC';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          + Add New Guest
        </Link>
      </div>

      {/* 🔍 Search Bar */}
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search guests by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 15px',
            width: '100%',
            maxWidth: '300px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '2px solid #FF492C',
            fontFamily: 'Figtree, sans-serif'
          }}
        />
      </div>

      {/* Currently Visiting Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <CardHolder
          title={`Currently Visiting (${visitingGuests.length})`}
          guests={visitingGuests}
          onAction={onCheckout}
          actionLabel="Check Out"
          actionColor="#dc3545"
        />
      </div>

      {/* Previous Guests Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <h3 style={{ 
            color: '#FF492C',
            fontSize: '22px',
            fontWeight: '600',
            margin: '0',
            fontFamily: 'Figtree, sans-serif'
          }}>
            Previous Guests
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ 
              color: '#062846',
              fontWeight: '500',
              fontSize: '14px',
              fontFamily: 'Figtree, sans-serif'
            }}>
              Filter by Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '2px solid #FF492C',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#062846',
                fontFamily: 'Figtree, sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>
        </div>
        
        <CardHolder
          title={`Checked Out on ${new Date(selectedDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} (${checkedOutGuests.length})`}
          guests={checkedOutGuests}
          actionColor="#6c757d"
        />
      </div>
    </div>
  );
};

export default GuestList;
