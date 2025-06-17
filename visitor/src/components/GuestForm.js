import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import { formatIndianPhone } from '../utils/formatIndianPhone';
import 'react-phone-input-2/lib/style.css';

const GuestForm = ({ onAddGuest }) => {
  const navigate = useNavigate();

  const getISTDate = () => {
    return new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    });
  };

  const getISTTime = () => {
    return new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [formData, setFormData] = useState({
    date: getISTDate(),
    name: '',
    company: '',
    idNumber: '',
    inTime: getISTTime(),
    purpose: '',
    outTime: '',
    approvalPerson: '',
    contact: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);
    try {
      const result = await onAddGuest(formData);
      if (result.success) {
        setMessage(result.message);
        setFormData({
          date: getISTDate(),
          name: '',
          company: '',
          idNumber: '',
          inTime: getISTTime(),
          purpose: '',
          outTime: '',
          approvalPerson: '',
          contact: ''
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '700px', 
      margin: '0 auto', 
      fontFamily: 'Figtree, sans-serif',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        color: '#FF492C', 
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        Add New Guest
      </h2>
      
      {message && (
        <div style={{
          padding: '15px',
          marginBottom: '25px',
          background: message.includes('success') ? '#27D3BC' : '#FF492C',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: '500'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            color: '#062846', 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Date:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            readOnly
            placeholder="YYYY-MM-DD"
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #FF492C',
              borderRadius: '8px',
              fontFamily: 'Figtree, sans-serif',
              backgroundColor: '#f8f9fa',
              color: '#6c757d',
              cursor: 'not-allowed',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            color: '#062846', 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            fontSize: '14px'
          }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Priya Sharma"
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #FF492C',
              borderRadius: '8px',
              fontFamily: 'Figtree, sans-serif',
              fontSize: '16px',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s ease'
            }}
          />
        </div>

        {/* Fixed Company and ID Number row with proper spacing */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <label style={{ 
              color: '#062846', 
              marginBottom: '8px', 
              display: 'block',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Company:
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g. Indiqube"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #FF492C',
                borderRadius: '8px',
                fontFamily: 'Figtree, sans-serif',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              minLength={2}
            />
          </div>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <label style={{ 
              color: '#062846', 
              marginBottom: '8px', 
              display: 'block',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              ID Number:
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              placeholder="e.g. EMP12345 or 123456789012"
              maxLength={20}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #FF492C',
                borderRadius: '8px',
                fontFamily: 'Figtree, sans-serif',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              pattern="[A-Za-z0-9]+"
              title="ID Number must be alphanumeric."
            />
          </div>
        </div>

        {/* Fixed Phone and Time row with equal widths */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <label style={{ 
              color: '#062846', 
              marginBottom: '8px', 
              display: 'block',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Phone Number:
            </label>
            <PhoneInput
              country={'in'}
              value={formData.contact}
              onChange={(phone) => {
                setFormData((prev) => ({ ...prev, contact: phone }));
              }}
              inputStyle={{
                width: '100%',
                padding: '12px 15px',
                paddingLeft: '70px',
                border: '2px solid #FF492C',
                borderRadius: '8px',
                fontFamily: 'Figtree, sans-serif',
                fontSize: '16px',
                height: '50px',
                boxSizing: 'border-box'
              }}
              containerStyle={{
                width: '100%'
              }}
              buttonStyle={{
                border: '2px solid #FF492C',
                borderRight: 'none',
                borderRadius: '8px 0 0 8px',
                backgroundColor: '#ffffff'
              }}
              enableSearch
              countryCodeEditable={false}
            />
          </div>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <label style={{ 
              color: '#062846', 
              marginBottom: '8px', 
              display: 'block',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              In Time:
            </label>
            <input
              type="time"
              name="inTime"
              value={formData.inTime}
              onChange={handleChange}
              required
              placeholder="HH:MM"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #FF492C',
                borderRadius: '8px',
                fontFamily: 'Figtree, sans-serif',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            color: '#062846',
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Purpose:
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            rows="3"
            placeholder="e.g. Client meeting"
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #FF492C',
              borderRadius: '8px',
              fontFamily: 'Figtree, sans-serif',
              fontSize: '16px',
              resize: 'vertical',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s ease'
            }}
            minLength={2}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            color: '#062846',
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Approval Person:
          </label>
          <input
            type="text"
            name="approvalPerson"
            value={formData.approvalPerson}
            onChange={handleChange}
            required
            placeholder="e.g. Amit Verma"
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #FF492C',
              borderRadius: '8px',
              fontFamily: 'Figtree, sans-serif',
              fontSize: '16px',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s ease'
            }}
            minLength={2}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: '#FF492C',
              color: '#ffffff',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              fontFamily: 'Figtree, sans-serif',
              fontSize: '16px',
              fontWeight: '600',
              minWidth: '140px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(255, 73, 44, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#e03e25';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#FF492C';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {isSubmitting ? 'Adding Guest...' : 'Add Guest'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#6c757d',
              color: '#ffffff',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Figtree, sans-serif',
              fontSize: '16px',
              fontWeight: '600',
              minWidth: '120px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(108, 117, 125, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#5a6268';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6c757d';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestForm;