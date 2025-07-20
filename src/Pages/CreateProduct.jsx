// CreateProducts.jsx
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
    phone: '',
    email: '',
    message: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    console.log('Photo selected:', file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    const form = new FormData();
    if (selectedImage) form.append("image", selectedImage);
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("condition", formData.condition);
    form.append("price", formData.price);
    form.append("location", formData.location);
    form.append("phone", formData.phone);
    form.append("email", formData.email);
    form.append("message", formData.message);

    try {
      const response = await fetch(`http://localhost:8080/api/products/upload/user/${userId}`, {
        method: "POST",
        body: form
      });

      if (!response.ok) throw new Error("Failed to create product");

      const result = await response.json();
      console.log("Product created successfully:", result);
      alert("Product listed successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading product");
    }
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
    // Implement save draft logic if needed
  };

  return (
    <div className="sell-item-container">
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
              <label className="form-label">Title <span className="required">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="What are you selling?" className="form-input" required />
            </div>
          </div>

          <div className="form-row full-width">
            <div className="form-group">
              <label className="form-label">Description <span className="required">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your item in detail..." className="form-textarea" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category <span className="required">*</span></label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="form-select" required>
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
              <label className="form-label">Condition <span className="required">*</span></label>
              <select name="condition" value={formData.condition} onChange={handleInputChange} className="form-select" required>
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
              <label className="form-label">Price <span className="required">*</span></label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" className="form-input" min="0" step="0.01" required />
            </div>

            <div className="form-group">
              <label className="form-label">Location <span className="required">*</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, State" className="form-input" required />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <h2 className="section-title">Contact Information</h2>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Optional message or additional info" />
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="btn btn-primary">List Item</button>
          <button type="button" className="btn btn-secondary" onClick={handleSaveDraft}>Save as Draft</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProducts;
