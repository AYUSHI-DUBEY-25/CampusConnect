import Layout from "../components/Layouts/Layout.jsx";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/cart.jsx";
import { useAuth } from "../context/auth.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API;

function CartPage() {
    const { auth } = useAuth();
    const { cart, setCart } = useCart();
    const [clientToken, setClientToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [dropInReady, setDropInReady] = useState(false);
    const [braintreeLoaded, setBraintreeLoaded] = useState(false);

    const dropinInstanceRef = useRef(null);
    const dropinContainerRef = useRef(null);
    const navigate = useNavigate();

    // -------------------------
    // TOTAL PRICE (considers quantity)
    // -------------------------
    const totalPrice = () => {
        let total = 0;
        cart?.forEach((item) => {
            const qty = Number(item.quantity ?? 1);
            total += qty * (Number(item.price) || 0);
        });
        return total.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
        });
    };

    // helper: user-specific storage key (keep parity with context)
    const storageKey = auth?.user?._id ? `cart_${auth.user._id}` : "cart";

    // -------------------------
    // REMOVE ITEM
    // -------------------------
    const removeCartItem = (pid) => {
        const myCart = Array.isArray(cart) ? [...cart] : [];
        const index = myCart.findIndex((item) => item._id === pid);
        if (index > -1) {
            myCart.splice(index, 1);
            setCart(myCart);
            try {
                localStorage.setItem(storageKey, JSON.stringify(myCart));
            } catch (e) {
                console.warn("Failed to write cart to localStorage", e);
            }
        }
    };

    // -------------------------
    // INCREASE / DECREASE qty
    // -------------------------
    const increaseQty = (pid) => {
        setCart((prev) => {
            const next = (prev ?? []).map((item) => {
                if (item._id !== pid) return item;
                const max = Number(item.maxTickets ?? item.ticketsAvailable ?? Infinity);
                const cur = Number(item.quantity ?? 1);
                if (cur >= max) {
                    toast(`Max ${max} tickets allowed for "${item.name}"`);
                    return { ...item, quantity: cur };
                }
                return { ...item, quantity: cur + 1 };
            });
            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
            } catch (e) {}
            return next;
        });
    };

    const decreaseQty = (pid) => {
        setCart((prev) => {
            let next = (prev ?? []).map((item) => {
                if (item._id !== pid) return item;
                const cur = Number(item.quantity ?? 1);
                const newQty = Math.max(cur - 1, 0);
                return { ...item, quantity: newQty };
            });
            next = next.filter((item) => Number(item.quantity ?? 1) > 0);
            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
            } catch (e) {}
            return next;
        });
    };

    // -------------------------
    // GET TOKEN
    // -------------------------
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/event/braintree/token`);
            setClientToken(data.clientToken);
        } catch (error) {
            console.log("Token error:", error);
            toast.error("Failed to load payment system");
        }
    };

    // -------------------------
    // LOAD BRAINTREE SDK
    // -------------------------
    useEffect(() => {
        if (window.braintree) {
            setBraintreeLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://js.braintreegateway.com/web/dropin/1.33.4/js/dropin.min.js";
        script.async = true;
        script.onload = () => {
            console.log("Braintree SDK loaded successfully");
            setBraintreeLoaded(true);
        };
        script.onerror = () => toast.error("Failed to load payment UI");

        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (auth?.token) getToken();
    }, [auth?.token]);

    // -------------------------
    // INITIALIZE DROP-IN
    // -------------------------
    useEffect(() => {
        if (!braintreeLoaded || !clientToken || !cart?.length || !auth?.token) {
            return;
        }

        initializeDropIn();

        return () => {
            cleanupDropIn();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [braintreeLoaded, clientToken, cart?.length, auth?.token]);

    // CLEANUP FUNCTION
    const cleanupDropIn = () => {
        if (dropinInstanceRef.current) {
            dropinInstanceRef.current.teardown().catch(() => {});
            dropinInstanceRef.current = null;
        }
        if (dropinContainerRef.current) {
            dropinContainerRef.current.innerHTML = "";
        }
    };

    // INIT FUNCTION
    const initializeDropIn = async () => {
        try {
            cleanupDropIn();

            const instance = await window.braintree.dropin.create({
                authorization: clientToken,
                container: dropinContainerRef.current,
                card: {
                    overrides: {
                        fields: {
                            number: { placeholder: "4111 1111 1111 1111" },
                            cvv: { placeholder: "123" },
                            expirationDate: { placeholder: "MM/YY" },
                        },
                    },
                },
                paypal: false,
                googlePay: false,
                applePay: false,
                venmo: false,
            });

            dropinInstanceRef.current = instance;
            setDropInReady(true);
            console.log("✅ Braintree DropIn initialized with cards only");
        } catch (error) {
            console.error("Braintree initialization error:", error);
            setDropInReady(false);
        }
    };
    const createOrderOnServer = async (cartItems, paymentResult, token) => {
        // server expects cart: [{ eventId, qty }, ...] and paymentResult object
        const payloadCart = cartItems.map((c) => ({
            eventId: c._id || c.id || c.eventId,
            qty: Number(c.quantity ?? c.qty ?? 1),
            name: c.name,
            price: c.price,
        }));

        console.log("CREATE-ORDER payloadCart:", payloadCart);
        console.log("CREATE-ORDER paymentResult:", paymentResult);

        const res = await axios.post(
  `${API}/api/v1/auth/create-order`,
  {
    cart: payloadCart,
    paymentResult,
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

        return res.data;
    };

    // HANDLE PAYMENT - updated to create order after success
    const handlePayment = async () => {
        if (!dropinInstanceRef.current) {
            toast.error("Payment UI not ready yet.");
            return;
        }

        // defensive checks
        if (!auth?.token) {
            toast.error("Please login to complete payment");
            return;
        }
        if (!cart?.length) {
            toast.error("Cart is empty");
            return;
        }

        try {
            setLoading(true);

            // 1) get nonce from dropin
            const payload = await dropinInstanceRef.current.requestPaymentMethod();
            console.log("Nonce from UI:", payload.nonce);

            // Build minimal cart for payment processing (server accepts this)
            const minimalCart = cart.map((item) => ({
                _id: item._id,
                price: item.price,
                quantity: item.quantity ?? 1,
            }));

            // 2) submit nonce to your payment processing endpoint
            const paymentResp = await axios.post(
  `${API}/api/v1/event/braintree/payment`,
  {
    nonce: payload.nonce,
    cart: minimalCart,
  },
  {
    headers: {
      Authorization: `Bearer ${auth?.token}`,
    },
  }
);


            console.log("Payment endpoint response:", paymentResp?.data);

            // If payment failed, stop here
            if (!paymentResp?.data?.success) {
                toast.error(paymentResp?.data?.message || "Payment failed");
                return;
            }

            // 3) payment succeeded on server — create order (snapshot items) BEFORE clearing cart
            const paymentResultForOrder = paymentResp?.data ?? { success: true };
            try {
                const createRes = await createOrderOnServer(cart, paymentResultForOrder, auth?.token);
                console.log("CREATE-ORDER response:", createRes);

                if (createRes?.success) {
                    // Only after create-order success, clear cart and localStorage
                    try {
                        localStorage.removeItem(storageKey);
                    } catch (e) {}
                    setCart([]);
                    toast.success("Payment successful and tickets saved!");
                    navigate("/dashboard/user/orders");
                } else {
                    // If order creation failed, notify user and keep cart intact so they can retry
                    console.error("Create-order returned not success:", createRes);
                    toast.error(createRes?.message || "Order creation failed after payment — contact support");
                }
            } catch (errCreate) {
                console.error("Error creating order after payment:", errCreate?.response?.data ?? errCreate.message ?? errCreate);
                toast.error("Order creation failed after payment — check console");
                // Optional: if you want to refund on failure, add server-side refund flow (not implemented here)
            }
        } catch (error) {
            console.log("Payment error status:", error?.response?.status);
console.log("Payment error data:", error?.response?.data);

            toast.error("Payment processing failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="cart-page bg-white" style={{ minHeight: "70vh" }}>
                <div className="row p-2">
                    <div className="col-md-12">
                        <h1 className="text-center bg-light p-2 mb-1">
                            {auth?.user ? `Hello ${auth?.user?.name}` : "Hello Guest"}
                        </h1>
                        <p className="text-center fs-2">
                            {cart?.length ? `You have ${cart.length} items` : "Your cart is empty"}
                        </p>
                    </div>
                </div>

                <div className="container-fluid p-5">
                    <div className="row">
                        <div className="col-md-6">
                            {cart?.map((p) => (
                                <div className="row card flex-row my-2 p-1" key={p._id}>
                                    <div className="col-md-4">
                                        <img
                                            src={`${API}/api/v1/event/event-photo/${p._id}`}
                                            className="card-img-top rounded-2"
                                            alt={p.name}
                                            height="150"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <p className="fs-4 fw-bold">{p.name}</p>
                                        <p>{p.description?.substring(0, 50)}</p>
                                        <p>Price: {p.price}</p>
                                    </div>
                                    <div className="col-md-4 d-flex flex-column align-items-end justify-content-center">
                                        <div className="d-flex align-items-center mb-2">
                                            <button className="btn btn-outline-secondary me-2" onClick={() => decreaseQty(p._id)}>
                                                −
                                            </button>

                                            <div style={{ minWidth: 36, textAlign: "center" }}>{p.quantity ?? 1}</div>

                                            <button className="btn btn-outline-secondary ms-2" onClick={() => increaseQty(p._id)}>
                                                +
                                            </button>
                                        </div>

                                        <button className="btn btn-danger" onClick={() => removeCartItem(p._id)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-md-6 cart-summary shadow rounded-3 p-4">
                            <h2>Cart Summary</h2>
                            <p>Total: {totalPrice()}</p>

                            <div className="mb-3">
                                <h4>Address</h4>
                                <p>{auth?.user?.address || "No address saved"}</p>
                                <button className="btn btn-outline-warning" onClick={() => navigate("/dashboard/user/profile")}>
                                    Update Address
                                </button>
                            </div>

                            <hr />

                            {clientToken && auth?.token && cart?.length ? (
                                <>
                                    <div
                                        ref={dropinContainerRef}
                                        id="dropin-container"
                                        style={{
                                            minHeight: "150px",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "15px",
                                        }}
                                    />

                                    <button className="btn btn-primary mt-3 w-100" onClick={handlePayment} disabled={loading || !dropInReady}>
                                        {loading ? "Processing..." : "Make Payment"}
                                    </button>
                                </>
                            ) : (
                                <p className="text-warning mt-3">Payment system loading...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default CartPage;
// frontend/src/pages/CartPage.jsx
// import Layout from "../components/Layouts/Layout.jsx";
// import { useState, useEffect, useRef } from "react";
// import { useCart } from "../context/cart.jsx";
// import { useAuth } from "../context/auth.jsx";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// function CartPage() {
//   const { auth } = useAuth();
//   const { cart, setCart } = useCart();
//   const [clientToken, setClientToken] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [dropInReady, setDropInReady] = useState(false);
//   const [braintreeLoaded, setBraintreeLoaded] = useState(false);

//   const dropinInstanceRef = useRef(null);
//   const dropinContainerRef = useRef(null);
//   const navigate = useNavigate();

//   const BACKEND = import.meta.env.VITE_BACKEND_URL;

//   // -------------------------
//   // TOTAL PRICE (considers quantity)
//   // -------------------------
//   const totalPrice = () => {
//     let total = 0;
//     cart?.forEach((item) => {
//       const qty = Number(item.quantity ?? 1);
//       total += qty * (Number(item.price) || 0);
//     });
//     return total.toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//     });
//   };

//   // helper: user-specific storage key
//   const storageKey = auth?.user?._id ? `cart_${auth.user._id}` : "cart";

//   // -------------------------
//   // REMOVE ITEM
//   // -------------------------
//   const removeCartItem = (pid) => {
//     const myCart = Array.isArray(cart) ? [...cart] : [];
//     const index = myCart.findIndex((item) => item._id === pid);
//     if (index > -1) {
//       myCart.splice(index, 1);
//       setCart(myCart);
//       try {
//         localStorage.setItem(storageKey, JSON.stringify(myCart));
//       } catch (e) {
//         console.warn("Failed to write cart to localStorage", e);
//       }
//     }
//   };

//   // -------------------------
//   // INCREASE / DECREASE qty
//   // -------------------------
//   const increaseQty = (pid) => {
//     setCart((prev) => {
//       const next = (prev ?? []).map((item) => {
//         if (item._id !== pid) return item;
//         const max = Number(item.maxTickets ?? item.ticketsAvailable ?? Infinity);
//         const cur = Number(item.quantity ?? 1);
//         if (cur >= max) {
//           toast(`Max ${max} tickets allowed for "${item.name}"`);
//           return { ...item, quantity: cur };
//         }
//         return { ...item, quantity: cur + 1 };
//       });
//       try {
//         localStorage.setItem(storageKey, JSON.stringify(next));
//       } catch (e) {}
//       return next;
//     });
//   };

//   const decreaseQty = (pid) => {
//     setCart((prev) => {
//       let next = (prev ?? []).map((item) => {
//         if (item._id !== pid) return item;
//         const cur = Number(item.quantity ?? 1);
//         const newQty = Math.max(cur - 1, 0);
//         return { ...item, quantity: newQty };
//       });
//       next = next.filter((item) => Number(item.quantity ?? 1) > 0);
//       try {
//         localStorage.setItem(storageKey, JSON.stringify(next));
//       } catch (e) {}
//       return next;
//     });
//   };

//   // -------------------------
//   // GET BRAINTREE TOKEN
//   // -------------------------
//   const getToken = async () => {
//     try {
//       const { data } = await axios.get(
//         `${BACKEND}/api/v1/event/braintree/token`
//       );
//       setClientToken(data.clientToken);
//     } catch (error) {
//       console.log("Token error:", error);
//       toast.error("Failed to load payment system");
//     }
//   };

//   // -------------------------
//   // LOAD BRAINTREE SDK
//   // -------------------------
//   useEffect(() => {
//     if (window.braintree) {
//       setBraintreeLoaded(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src =
//       "https://js.braintreegateway.com/web/dropin/1.33.4/js/dropin.min.js";
//     script.async = true;
//     script.onload = () => {
//       setBraintreeLoaded(true);
//     };
//     script.onerror = () => toast.error("Failed to load payment UI");

//     document.head.appendChild(script);
//   }, []);

//   useEffect(() => {
//     if (auth?.token) getToken();
//   }, [auth?.token]);

//   // -------------------------
//   // INITIALIZE DROP-IN
//   // -------------------------
//   useEffect(() => {
//     if (!braintreeLoaded || !clientToken || !cart?.length || !auth?.token) {
//       return;
//     }

//     initializeDropIn();

//     return () => {
//       cleanupDropIn();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [braintreeLoaded, clientToken, cart?.length, auth?.token]);

//   const cleanupDropIn = () => {
//     if (dropinInstanceRef.current) {
//       dropinInstanceRef.current.teardown().catch(() => {});
//       dropinInstanceRef.current = null;
//     }
//     if (dropinContainerRef.current) {
//       dropinContainerRef.current.innerHTML = "";
//     }
//   };

//   const initializeDropIn = async () => {
//     try {
//       cleanupDropIn();

//       const instance = await window.braintree.dropin.create({
//         authorization: clientToken,
//         container: dropinContainerRef.current,
//         paypal: false,
//         googlePay: false,
//         applePay: false,
//         venmo: false,
//       });

//       dropinInstanceRef.current = instance;
//       setDropInReady(true);
//     } catch (error) {
//       console.error("Braintree initialization error:", error);
//       setDropInReady(false);
//     }
//   };

//   // -------------------------
//   // HANDLE PAYMENT
//   // -------------------------
//   const handlePayment = async () => {
//     if (!dropinInstanceRef.current) {
//       toast.error("Payment UI not ready yet.");
//       return;
//     }

//     if (!auth?.token) {
//       toast.error("Please login to complete payment");
//       return;
//     }

//     if (!cart?.length) {
//       toast.error("Cart is empty");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload =
//         await dropinInstanceRef.current.requestPaymentMethod();

//       const paymentResp = await axios.post(
//         `${BACKEND}/api/v1/event/braintree/payment`,
//         {
//           nonce: payload.nonce,
//           cart,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         }
//       );

//       if (!paymentResp?.data?.success) {
//         toast.error(paymentResp?.data?.message || "Payment failed");
//         return;
//       }

//       try {
//         localStorage.removeItem(storageKey);
//       } catch (e) {}

//       setCart([]);
//       toast.success("Payment successful!");
//       navigate("/dashboard/user/orders");
//     } catch (error) {
//       console.log("Payment error:", error);
//       toast.error("Payment processing failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="cart-page bg-white" style={{ minHeight: "70vh" }}>
//         <div className="row p-2">
//           <div className="col-md-12">
//             <h1 className="text-center bg-light p-2 mb-1">
//               {auth?.user ? `Hello ${auth?.user?.name}` : "Hello Guest"}
//             </h1>
//             <p className="text-center fs-2">
//               {cart?.length
//                 ? `You have ${cart.length} items`
//                 : "Your cart is empty"}
//             </p>
//           </div>
//         </div>

//         <div className="container-fluid p-5">
//           <div className="row">
//             <div className="col-md-6">
//               {cart?.map((p) => (
//                 <div className="row card flex-row my-2 p-1" key={p._id}>
//                   <div className="col-md-4">
//                     <img
//                       src={`${BACKEND}/api/v1/event/event-photo/${p._id}`}
//                       className="card-img-top rounded-2"
//                       alt={p.name}
//                       height="150"
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <p className="fs-4 fw-bold">{p.name}</p>
//                     <p>{p.description?.substring(0, 50)}</p>
//                     <p>Price: {p.price}</p>
//                   </div>
//                   <div className="col-md-4 d-flex flex-column align-items-end justify-content-center">
//                     <div className="d-flex align-items-center mb-2">
//                       <button
//                         className="btn btn-outline-secondary me-2"
//                         onClick={() => decreaseQty(p._id)}
//                       >
//                         −
//                       </button>

//                       <div style={{ minWidth: 36, textAlign: "center" }}>
//                         {p.quantity ?? 1}
//                       </div>

//                       <button
//                         className="btn btn-outline-secondary ms-2"
//                         onClick={() => increaseQty(p._id)}
//                       >
//                         +
//                       </button>
//                     </div>

//                     <button
//                       className="btn btn-danger"
//                       onClick={() => removeCartItem(p._id)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="col-md-6 cart-summary shadow rounded-3 p-4">
//               <h2>Cart Summary</h2>
//               <p>Total: {totalPrice()}</p>

//               <div className="mb-3">
//                 <h4>Address</h4>
//                 <p>{auth?.user?.address || "No address saved"}</p>
//                 <button
//                   className="btn btn-outline-warning"
//                   onClick={() => navigate("/dashboard/user/profile")}
//                 >
//                   Update Address
//                 </button>
//               </div>

//               <hr />

//               {clientToken && auth?.token && cart?.length ? (
//                 <>
//                   <div
//                     ref={dropinContainerRef}
//                     id="dropin-container"
//                     style={{
//                       minHeight: "150px",
//                       border: "1px solid #ddd",
//                       borderRadius: "4px",
//                       padding: "15px",
//                     }}
//                   />

//                   <button
//                     className="btn btn-primary mt-3 w-100"
//                     onClick={handlePayment}
//                     disabled={loading || !dropInReady}
//                   >
//                     {loading ? "Processing..." : "Make Payment"}
//                   </button>
//                 </>
//               ) : (
//                 <p className="text-warning mt-3">
//                   Payment system loading...
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default CartPage;
