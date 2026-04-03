import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const { data } = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Transform cart items to include product details
      const transformedItems = (data.items || []).map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category,
        brand: item.product.brand,
        qty: item.qty,
      }));

      // Set cart items
      setCartItems(transformedItems);

      // count total items
      const total = transformedItems.reduce((acc, item) => acc + item.qty, 0);
      setCartCount(total || 0);
    } catch (err) {
      console.log("Fetch cart error:", err);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await API.delete(`/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const updateQty = async (productId, qty) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await API.put(
        `/cart/${productId}`,
        { qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartCount, cartItems, fetchCart, removeFromCart, updateQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);