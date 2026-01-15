// import React, { useEffect, useState } from "react";
// import Usermenu from "../../components/Layouts/UserMenu";
// import Layout from "../../components/Layouts/Layout";
// import axios from "axios";
// import { useAuth } from "../../context/auth";
// import moment from "moment";

// const Orders = () => {
//   const { auth } = useAuth();
//   const [tickets, setTickets] = useState([]); 
//   const [loading, setLoading] = useState(true);

//   const formatCurrency = (val) => {
//     const n = Number(val || 0);
//     try {
//       return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
//     } catch {
//       return `₹${n.toFixed(2)}`;
//     }
//   };

//   useEffect(() => {
//     let mounted = true;
//     const controller = new AbortController();

//     const load = async () => {
//       if (!auth?.token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
        
//       const res = await axios.get("http://localhost:8080/api/v1/auth/my-orders", {
//   headers: { Authorization: `Bearer ${auth.token}` },
//   signal: controller.signal,
// });
//         const data = res.data;
//         let orders = [];
//         if (Array.isArray(data)) orders = data;
//         else if (Array.isArray(data?.orders)) orders = data.orders;
//         else if (Array.isArray(data?.data)) orders = data.data;
//         else {
//           const firstArray = Object.values(data || {}).find((v) => Array.isArray(v));
//           orders = firstArray ?? [];
//         }

//         const allTickets = [];
//         for (const o of orders) {
//           const orderId = o?._id ?? o?.id ?? "unknown-order";
//           const rawItems = o?.items ?? o?.products ?? o?.event ?? [];
//           const items = Array.isArray(rawItems) ? rawItems : [];

//           for (const it of items) {
//             const name = it?.name ?? it?.title ?? "Untitled Event";
//             const date = it?.date ?? it?.eventDate ?? o?.eventDate ?? null;
//             const qty = Number(it?.qty ?? it?.quantity ?? it?.tickets ?? 1) || 1;
//             const price = Number(it?.price ?? it?.cost ?? it?.amount ?? 0) || 0;
//             const subtotal = price * qty;

//             allTickets.push({
//               orderId,
//               name,
//               date,
//               qty,
//               price,
//               subtotal,
//             });
//           }
//         }

//         if (mounted) {
//           setTickets(allTickets);
//           setLoading(false);
//         }
//       } catch (err) {
//         if (err.name === "AbortError" || err.message?.includes("canceled")) return;
//         console.error("Failed to load orders:", err?.response?.data ?? err.message ?? err);
//         if (mounted) {
//           setTickets([]);
//           setLoading(false);
//         }
//       }
//     };

//     load();
//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, [auth?.token]);

//   return (
//     <Layout title={"Your Tickets"}>
//       <div className="container p-3 m-3">
//         <div className="row">
//           <div className="col-md-3">
//             <Usermenu />
//           </div>

//           <div className="col-md-9">
//             <h2 className="mb-4">My Tickets</h2>

//             {loading && <div className="alert alert-info">Loading tickets...</div>}

//             {!loading && tickets.length === 0 && (
//               <div className="alert alert-info">You have no tickets yet.</div>
//             )}

//             <div className="d-flex flex-column gap-3">
//               {!loading &&
//                 tickets.map((t, i) => (
//                   <div key={`${t.orderId}-${i}`} className="card p-3 shadow-sm">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <div style={{ fontSize: 18, fontWeight: 700 }}>{t.name}</div>
//                         <div style={{ color: "#6c757d", marginTop: 4 }}>
//                           {t.date ? moment(t.date).format("DD MMM YYYY, hh:mm A") : "Date not available"}
//                         </div>
//                       </div>

//                       <div style={{ textAlign: "right" }}>
//                         <div style={{ fontWeight: 700, fontSize: 16 }}>{formatCurrency(t.subtotal)}</div>
//                         <div style={{ color: "#6c757d", marginTop: 6 }}>Qty: {t.qty}</div>
//                         <div style={{ color: "#adb5bd", fontSize: 12, marginTop: 6 }}>Order: {String(t.orderId).slice(-8)}</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Orders;

import React, { useEffect, useState } from "react";
import Usermenu from "../../components/Layouts/UserMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const { auth } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (val) => {
    const n = Number(val || 0);
    try {
      return n.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch {
      return `₹${n.toFixed(2)}`;
    }
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadOrders = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
            signal: controller.signal,
          }
        );

        let orders = [];
        if (Array.isArray(data)) orders = data;
        else if (Array.isArray(data?.orders)) orders = data.orders;
        else if (Array.isArray(data?.data)) orders = data.data;
        else {
          const firstArray = Object.values(data || {}).find((v) =>
            Array.isArray(v)
          );
          orders = firstArray ?? [];
        }

        const allTickets = [];

        for (const o of orders) {
          const orderId = o?._id ?? o?.id ?? "unknown-order";
          const rawItems = o?.items ?? o?.products ?? o?.event ?? [];
          const items = Array.isArray(rawItems) ? rawItems : [];

          for (const it of items) {
            const name = it?.name ?? it?.title ?? "Untitled Event";
            const date =
              it?.date ?? it?.eventDate ?? o?.eventDate ?? null;
            const qty =
              Number(it?.qty ?? it?.quantity ?? it?.tickets ?? 1) || 1;
            const price =
              Number(it?.price ?? it?.cost ?? it?.amount ?? 0) || 0;

            allTickets.push({
              orderId,
              name,
              date,
              qty,
              price,
              subtotal: price * qty,
            });
          }
        }

        if (mounted) {
          setTickets(allTickets);
          setLoading(false);
        }
      } catch (error) {
        if (
          error.name === "AbortError" ||
          error.message?.includes("canceled")
        )
          return;

        console.error(
          "Failed to load orders:",
          error?.response?.data ?? error.message ?? error
        );

        if (mounted) {
          setTickets([]);
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [auth?.token]);

  return (
    <Layout title={"Your Tickets"}>
      <div className="container p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <Usermenu />
          </div>

          <div className="col-md-9">
            <h2 className="mb-4">My Tickets</h2>

            {loading && (
              <div className="alert alert-info">Loading tickets...</div>
            )}

            {!loading && tickets.length === 0 && (
              <div className="alert alert-info">
                You have no tickets yet.
              </div>
            )}

            <div className="d-flex flex-column gap-3">
              {!loading &&
                tickets.map((t, i) => (
                  <div
                    key={`${t.orderId}-${i}`}
                    className="card p-3 shadow-sm"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                          {t.name}
                        </div>
                        <div style={{ color: "#6c757d", marginTop: 4 }}>
                          {t.date
                            ? moment(t.date).format(
                                "DD MMM YYYY, hh:mm A"
                              )
                            : "Date not available"}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{ fontWeight: 700, fontSize: 16 }}
                        >
                          {formatCurrency(t.subtotal)}
                        </div>
                        <div style={{ color: "#6c757d", marginTop: 6 }}>
                          Qty: {t.qty}
                        </div>
                        <div
                          style={{
                            color: "#adb5bd",
                            fontSize: 12,
                            marginTop: 6,
                          }}
                        >
                          Order: {String(t.orderId).slice(-8)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
