import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import { formatIndianPhone } from '../utils/formatIndianPhone';

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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add New Guest</h2>
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          background: message.includes('success') ? '#dfd' : '#fdd',
          border: `1px solid ${message.includes('success') ? '#4f4' : '#f44'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '15px' }}>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            readOnly
            placeholder="YYYY-MM-DD"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Priya Sharma"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            minLength={2}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Company:</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="e.g. Indiqube"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            minLength={2}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>ID Number:</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
            placeholder="e.g. EMP12345 or 123456789012"
            maxLength={20}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            pattern="[A-Za-z0-9]+"
            title="ID Number must be alphanumeric."
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>In Time:</label>
          <input
            type="time"
            name="inTime"
            value={formData.inTime}
            onChange={handleChange}
            required
            placeholder="HH:MM"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Purpose:</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            rows="3"
            placeholder="e.g. Client meeting"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            minLength={2}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Approval Person:</label>
          <input
            type="text"
            name="approvalPerson"
            value={formData.approvalPerson}
            onChange={handleChange}
            required
            placeholder="e.g. Amit Verma"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            minLength={2}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number:</label>
          <PhoneInput
            country={'in'}
            value={formData.contact}
            onChange={(phone) => {
              setFormData((prev) => ({ ...prev, contact: phone }));
            }}
            inputStyle={{
              width: '100%',
              padding: '8px',
              paddingLeft: '65px', // 👈 keep this to avoid overlap
              marginTop: '5px'
            }}
            enableSearch
            countryCodeEditable={false}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Adding Guest...' : 'Add Guest'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
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