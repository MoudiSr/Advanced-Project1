import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, placeOrder } = useContext(CartContext);
// Calculate total price dynamically
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container py-4">
      <h2 className="text-center text-danger">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center mt-3">Your cart is empty</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Qty</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      className="form-control"
                      style={{ width: "70px" }}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="text-end">
          <h4>Total: ${cartTotal.toFixed(2)}</h4>
          <button className="btn btn-success" onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
