import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = ({ userId = 1 }) => { // Default userId for testing, consider prop validation in a real app
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false); // Separate loading for actions

    // API base URL - adjust according to your backend configuration
    const API_BASE_URL = 'http://localhost:8080/api/cart';
    const IMAGE_BASE_URL = 'http://localhost:8080';

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/80x80?text=No+Image';

        // If it's already a complete URL, return as is
        if (imagePath.startsWith('http')) return imagePath;

        // Ensure leading slash if missing for '/uploads/'
        if (imagePath.startsWith('uploads/')) {
            imagePath = '/' + imagePath;
        }
        
        // If it starts with /uploads, prepend the base URL
        if (imagePath.startsWith('/uploads/')) {
            return `${IMAGE_BASE_URL}${imagePath}`;
        }

        // Default case - assume it needs /uploads/ prefix
        return `${IMAGE_BASE_URL}/uploads/${imagePath}`;
    };

    // Fetch cart items from backend
    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/${userId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const cartData = await response.json();
            console.log('🔍 Raw cart data from backend:', cartData);

            // Let's examine the first item to understand the structure
            if (cartData.length > 0) {
                console.log('🔍 First cart item structure:', cartData[0]);
                console.log('🔍 Available keys in first item:', Object.keys(cartData[0]));
            }

            // Transform backend data to match frontend structure
            const transformedItems = cartData.map((item, index) => {
                console.log(`🔍 Processing item ${index}:`, item);

                const transformedItem = {
                    // Use item.id from CartDTO
                    id: item.id,
                    // Prefer item.productId from CartDTO, or fall back to item.product.id
                    productId: item.productId || item.product?.id,
                    name: item.product?.title || item.title || 'Product Name', // DTO now has product.title
                    seller: item.product?.seller || item.seller || 'Unknown Seller', // DTO now has product.seller
                    location: item.product?.location || item.location || 'Unknown Location', // DTO now has product.location
                    price: item.product?.price || item.price || 0, // DTO now has product.price
                    quantity: item.quantity || 1, // Quantity is direct on CartDTO
                    // Use item.product?.imageUrl for the image
                    image: getImageUrl(item.product?.imageUrl || item.imageUrl || item.image)
                };

                console.log(`🔍 Transformed item ${index}:`, transformedItem);

                // Check if productId is still missing (important for actions)
                if (!transformedItem.productId) {
                    console.error('❌ ProductId still missing after transformation. Item:', item);
                }

                return transformedItem;
            });

            setCartItems(transformedItems);
            setError(null);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(`Failed to fetch cart: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        try {
            setActionLoading(true);
            console.log(`Adding to cart: userId=${userId}, productId=${productId}, quantity=${quantity}`);

            const response = await fetch(`${API_BASE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userId.toString(),
                    productId: productId.toString(),
                    quantity: quantity.toString()
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add item to cart: ${errorText}`);
            }

            console.log('Item added successfully');
            // Refresh cart after adding
            await fetchCartItems();
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(`Failed to add to cart: ${err.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    // Update item quantity
    const updateQuantity = async (productId, newQuantity) => {
        console.log(`updateQuantity called: productId=${productId}, newQuantity=${newQuantity}`);

        if (newQuantity < 1) {
            console.log('Quantity less than 1, removing item');
            await removeItem(productId);
            return;
        }

        try {
            setActionLoading(true);
            console.log(`Updating quantity: userId=${userId}, productId=${productId}, quantity=${newQuantity}`);

            // Optimistically update the UI first
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );

            const response = await fetch(`${API_BASE_URL}/update`, {
                method: 'PUT', // Correct method for updating
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userId.toString(),
                    productId: productId.toString(),
                    quantity: newQuantity.toString()
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Update failed:', errorText);
                // Revert optimistic update on failure
                await fetchCartItems();
                throw new Error(`Update failed: ${errorText}`);
            }

            console.log('Quantity updated successfully');

        } catch (err) {
            console.error('Error updating quantity:', err);
            setError(`Failed to update quantity: ${err.message}`);
            // Refresh cart to ensure UI is in sync
            await fetchCartItems();
        } finally {
            setActionLoading(false);
        }
    };


    // Remove item from cart
    const removeItem = async (productId) => {
        try {
            setActionLoading(true);
            console.log(`Removing item: userId=${userId}, productId=${productId}`);

            // Optimistically remove from UI first
            setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));

            const response = await fetch(`${API_BASE_URL}/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userId.toString(),
                    productId: productId.toString()
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Remove failed:', errorText);
                // Revert optimistic update on failure
                await fetchCartItems();
                throw new Error(`Failed to remove item: ${errorText}`);
            }

            console.log('Item removed successfully');

        } catch (err) {
            console.error('Error removing item:', err);
            setError(`Failed to remove item: ${err.message}`);
            // Refresh cart to ensure UI is in sync
            await fetchCartItems();
        } finally {
            setActionLoading(false);
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        try {
            setActionLoading(true);
            console.log(`Clearing cart for userId=${userId}`);

            const response = await fetch(`${API_BASE_URL}/clear/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to clear cart: ${errorText}`);
            }

            console.log('Cart cleared successfully');
            setCartItems([]);
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError(`Failed to clear cart: ${err.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    // Handle image loading errors
    const handleImageError = (e) => {
        console.error('Image failed to load:', e.target.src);
        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
    };

    // Load cart on component mount
    useEffect(() => {
        console.log('🔵 Cart component mounted, fetching cart items...');
        fetchCartItems();
    }, [userId]); // Re-fetch if userId changes

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 15 : 0;
    const tax = subtotal * 0.01; // Example: 1% tax
    const total = subtotal + shipping + tax;

    if (loading) {
        return (
            <div className="shopping-cart-container">
                <div className="loading">Loading cart...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shopping-cart-container">
                <div className="error">
                    <p>Error: {error}</p>
                    <button onClick={fetchCartItems}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="shopping-cart-container">
            {/* Main Content */}
            <main className="main-content">
                <div className="cart-section">
                    <div className="cart-header">
                        <h1 className="cart-title">Shopping Cart</h1>
                        <p className="cart-subtitle">{cartItems.length} items in your cart</p>
                        {cartItems.length > 0 && (
                            <button
                                className="clear-cart-btn"
                                onClick={clearCart}
                                disabled={actionLoading}
                                style={{
                                    marginLeft: 'auto',
                                    padding: '8px 16px',
                                    backgroundColor: actionLoading ? '#999' : '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: actionLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {actionLoading ? 'Clearing...' : 'Clear Cart'}
                            </button>
                        )}
                    </div>

                    <div className="cart-items">
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <p>Your cart is empty</p>
                                <button className="continue-shopping-btn">← Start Shopping</button>
                            </div>
                        ) : (
                            cartItems.map((item, index) => {
                                console.log(`🔍 Rendering item ${index}:`, item);
                                return (
                                    <div key={`${item.id}-${item.productId}-${index}`} className="cart-item">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="item-image"
                                            onError={handleImageError}
                                        />
                                        <div className="item-details">
                                            <h3 className="item-name">{item.name}</h3>
                                            <p className="item-seller">Sold by {item.seller}</p>
                                            <p className="item-location">📍 {item.location}</p>
                                            {/* Debugging: Uncomment to see IDs if needed */}
                                            {/* <p style={{ fontSize: '12px', color: '#666' }}>
                                                DEBUG: CartID={item.id}, ProductID={item.productId}
                                            </p> */}
                                        </div>
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => {
                                                    console.log('🔵 Decrease button clicked for productId:', item.productId);
                                                    if (item.productId) {
                                                        updateQuantity(item.productId, item.quantity - 1);
                                                    } else {
                                                        console.error('❌ ProductId is missing:', item);
                                                        alert('Error: Product ID is missing');
                                                    }
                                                }}
                                                disabled={actionLoading}
                                                style={{
                                                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                                                    opacity: actionLoading ? 0.5 : 1,
                                                    backgroundColor: '#f0f0f0',
                                                    border: '1px solid #ccc',
                                                    padding: '5px 10px'
                                                }}
                                            >
                                                −
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => {
                                                    console.log('🔵 Increase button clicked for productId:', item.productId);
                                                    if (item.productId) {
                                                        updateQuantity(item.productId, item.quantity + 1);
                                                    } else {
                                                        console.error('❌ ProductId is missing:', item);
                                                        alert('Error: Product ID is missing');
                                                    }
                                                }}
                                                disabled={actionLoading}
                                                style={{
                                                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                                                    opacity: actionLoading ? 0.5 : 1,
                                                    backgroundColor: '#f0f0f0',
                                                    border: '1px solid #ccc',
                                                    padding: '5px 10px'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => {
                                                console.log('🔵 Remove button clicked for productId:', item.productId);
                                                if (item.productId) {
                                                    removeItem(item.productId);
                                                } else {
                                                    console.error('❌ ProductId is missing:', item);
                                                    alert('Error: Product ID is missing');
                                                }
                                            }}
                                            disabled={actionLoading}
                                            title="Remove item"
                                            style={{
                                                cursor: actionLoading ? 'not-allowed' : 'pointer',
                                                opacity: actionLoading ? 0.5 : 1,
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '3px'
                                            }}
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <div className="order-summary">
                        <h2 className="summary-title">Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>₹{shipping.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn">Proceed to Checkout</button>
                        <button className="continue-shopping-btn">← Continue Shopping</button>
                        <p className="secure-checkout">Secure checkout powered by SwapNest</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;