import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product, Voucher } from "@shared/products";

interface CartState {
  items: CartItem[];
  appliedVoucher: Voucher | null;
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; customRequest?: string } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "APPLY_VOUCHER"; payload: Voucher }
  | { type: "REMOVE_VOUCHER" }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "LOAD_CART"; payload: CartState };

interface CartContextType extends CartState {
  addItem: (product: Product, customRequest?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyVoucher: (voucher: Voucher) => void;
  removeVoucher: () => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getItemCount: () => number;
  getTShirtCount: () => number;
  getBeltCount: () => number;
  canCheckout: () => boolean;
  getCheckoutError: () => string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, customRequest } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === product.id && item.customRequest === customRequest,
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id && item.customRequest === customRequest
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1, customRequest }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    case "APPLY_VOUCHER":
      return {
        ...state,
        appliedVoucher: action.payload,
      };
    case "REMOVE_VOUCHER":
      return {
        ...state,
        appliedVoucher: null,
      };
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        appliedVoucher: null,
      };
    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  appliedVoucher: null,
  isOpen: false,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("wwe-cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartData });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wwe-cart", JSON.stringify(state));
  }, [state]);

  const addItem = (product: Product, customRequest?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { product, customRequest } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
  };

  const applyVoucher = (voucher: Voucher) => {
    dispatch({ type: "APPLY_VOUCHER", payload: voucher });
  };

  const removeVoucher = () => {
    dispatch({ type: "REMOVE_VOUCHER" });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const getSubtotal = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const getDiscount = () => {
    if (!state.appliedVoucher) return 0;
    const subtotal = getSubtotal();
    if (state.appliedVoucher.type === "percentage") {
      return subtotal * (state.appliedVoucher.discount / 100);
    }
    return state.appliedVoucher.discount;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTShirtCount = () => {
    return state.items
      .filter((item) => item.id.startsWith("T"))
      .reduce((total, item) => total + item.quantity, 0);
  };

  const getBeltCount = () => {
    return state.items
      .filter((item) => !item.id.startsWith("T"))
      .reduce((total, item) => total + item.quantity, 0);
  };

  const canCheckout = () => {
    const tshirtCount = getTShirtCount();
    const beltCount = getBeltCount();

    if (tshirtCount === 0 && beltCount === 0) {
      return false;
    }

    if (tshirtCount > 0 && beltCount === 0 && tshirtCount < 4) {
      return false;
    }

    return true;
  };

  const getCheckoutError = () => {
    const tshirtCount = getTShirtCount();
    const beltCount = getBeltCount();

    if (tshirtCount > 0 && beltCount === 0 && tshirtCount < 4) {
      return `You need at least 4 t-shirts to checkout without a belt. Currently you have ${tshirtCount} t-shirt${tshirtCount !== 1 ? "s" : ""}.`;
    }

    return null;
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    applyVoucher,
    removeVoucher,
    clearCart,
    toggleCart,
    getTotal,
    getSubtotal,
    getDiscount,
    getItemCount,
    getTShirtCount,
    getBeltCount,
    canCheckout,
    getCheckoutError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
