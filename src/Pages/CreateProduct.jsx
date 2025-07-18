// SellItemForm.jsx
import React, { useState } from 'react';
import './CreateProduct.css';

const CreateProducts = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    location: '',
    contactPreference: 'Phone'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    // Handle photo upload logic here
    console.log('Photos selected:', files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
    // Handle save draft logic
  };

  return (
    <div className="sell-item-container">
      {/* <div className="header">
        <h1>Sell Your Item</h1>
        <p>Create a listing to sell your item on SnapDeal</p>
      </div> */}

      <form onSubmit={handleSubmit}>
        {/* Photos Section */}
        <div className="form-section">
          <h2 className="section-title">Photos</h2>
          <div className="photo-upload" onClick={() => document.getElementById('photo-input').click()}>
            <div className="photo-upload-icon">📷</div>
            <div className="photo-upload-text">Add Photos</div>
            <div className="photo-upload-subtext">Add up to 6 photos - first photo will be your main image</div>
            <input
              id="photo-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden-file-input"
            />
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          
          <div className="form-row full-width">
            <div className="form-group">
              <label className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What are you selling?"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row full-width">
            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your item in detail..."
                className="form-textarea"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
                <option value="books">Books</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Condition <span className="required">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price & Location Section */}
        <div className="form-section">
          <h2 className="section-title">Price & Location</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Price <span className="required">*</span>
              </label>
              <div className="price-input-group">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Location <span className="required">*</span>
              </label>
              <div className="location-input-group">
                <span className="location-icon">📍</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Preference Section */}
        <div className="form-section">
          <h2 className="section-title">Contact Preference</h2>
          
          <div className="form-row">
            <div className="form-group">
              <select
                name="contactPreference"
                value={formData.contactPreference}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
                <option value="Message">Message</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            List Item
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSaveDraft}>
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProducts;