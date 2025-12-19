import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CartItem {
  supplierId: number;
  supplierName: string;
  mealType: string;
  rating: number;
  image: string;
  planDays?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (mealType: string) => void;
  isInCart: (mealType: string) => boolean;
  getSupplierInCart: (mealType: string) => number | null;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem): boolean => {
    // Check if meal type already exists in cart
    const existingItem = cart.find(cartItem => cartItem.mealType === item.mealType);
    
    if (existingItem) {
      // Replace existing item with new supplier
      setCart(cart.map(cartItem => 
        cartItem.mealType === item.mealType ? { ...item } : cartItem
      ));
      return true;
    }
    
    // Check if cart is full (max 3 items)
    if (cart.length >= 3) {
      alert('Cart is full! Maximum 3 meal types (Breakfast, Lunch, Dinner) allowed.');
      return false;
    }
    
    // Add new item
    setCart([...cart, item]);
    return true;
  };

  const removeFromCart = (mealType: string) => {
    setCart(cart.filter(item => item.mealType !== mealType));
  };

  const isInCart = (mealType: string): boolean => {
    return cart.some(item => item.mealType === mealType);
  };

  const getSupplierInCart = (mealType: string): number | null => {
    const item = cart.find(item => item.mealType === mealType);
    return item ? item.supplierId : null;
  };

  const getCartCount = (): number => {
    return cart.length;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, getSupplierInCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
