import React, { useState, useEffect } from "react";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Price";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layouts/Layout";
import { useNavigate } from "react-router-dom";
import { AiOutlineReload } from "react-icons/ai";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import "./Events.css";

const Events = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const { auth } = useAuth();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ticketQty, setTicketQty] = useState(1);
  const [ticketsAvailable, setTicketsAvailable] = useState(0);


  useEffect(() => {
    if (selectedEvent) {
      setTicketQty(1);
    }
  }, [selectedEvent]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data.category);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-count`
      );
      setTotal(data.total);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-list/${page}`
      );
      setLoading(false);
      setEvents(data.event);
      console.log("events loaded (tickets):", data.event?.slice(0, 5).map(e => ({ id: e._id, tickets: e.ticketsAvailable })));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-list/${page}`
      );
      setLoading(false);
      setEvents([...events, ...data.event]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };
  const filterEvent = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-filters`,
        { checked, radio }
      );
      setEvents(data.event);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllEvents();
  }, []);
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    if (checked.length === 0 && radio.length === 0) {
      getAllEvents();
    } else {
      filterEvent();
    }
  }, [checked, radio]);

const addItemToCart = (item) => {
  if (!auth?.user) {
    toast.error("Please login to add items to cart");
    navigate("/login", { state: { from: "/events" } });
    return false;
  }

  const qtyToAdd = Number(item.quantity || 1);
  const available = Number(item.ticketsAvailable || 0);

  if (available <= 0) {
    toast.error("No tickets available for this event");
    return false;
  }
  const existingIndex = cart.findIndex((c) => c._id === item._id);
  const existing = existingIndex !== -1 ? cart[existingIndex] : null;
  const existingQty = existing ? Number(existing.quantity || 1) : 0;

  const desiredQty = existingQty + qtyToAdd;

  if (desiredQty > available) {
    toast.error(`Only ${available - existingQty} more tickets available`);
    return false;
  }

  let updatedCart = [];
  if (existing) {
    updatedCart = cart.map((c, idx) =>
      idx === existingIndex ? { ...c, quantity: desiredQty } : c
    );
  } else {
    updatedCart = [...cart, { ...item, quantity: qtyToAdd }];
  }
  setCart(updatedCart);
  try {
    const key = auth?.user?._id ? `cart_${auth.user._id}` : "cart";
    localStorage.setItem(key, JSON.stringify(updatedCart));
  } catch (err) {
    console.error("Failed to persist cart to localStorage", err);
  }

  toast.success("Added to Cart");
  return true;
};


const EventCard = ({ p }) => {
  const [hover, setHover] = useState(false);
  const inCartEntry = cart.find((c) => c._id === p._id);
  const inCartQty = inCartEntry ? Number(inCartEntry.quantity || 0) : 0;
  const canAddMore = (Number(p.ticketsAvailable || 0) - inCartQty) > 0;

  const handleAddToCart = () => {
    addItemToCart({ ...p, quantity: 1 });
  };

  return (
    <div
      className="event-card"
      style={{
        width: "320px",
        borderRadius: 12,
        overflow: "hidden",
        background: "white",
        boxShadow: hover
          ? "0 18px 40px rgba(17,24,39,0.12)"
          : "0 6px 18px rgba(17,24,39,0.06)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 300ms cubic-bezier(.2,.8,.2,1)",
        margin: "12px",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ position: "relative", minHeight: 200 }}>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-photo/${p._id}`}
          alt={p.name}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: p.price === 0 ? "#16a34a" : "rgba(0,0,0,0.6)",
            color: "white",
            padding: "6px 10px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {p.price === 0
            ? "FREE"
            : p.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
        </div>
      </div>

      <div style={{ padding: 16, flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h5 style={{ margin: 0, fontSize: 18 }}>{p.name}</h5>
        </div>

        <p style={{ marginTop: 8, marginBottom: 12, color: "#475569", flex: "1 1 auto", fontSize: 14 }}>
          {p.description?.substring(0, 100)}
          {p.description?.length > 100 ? "..." : ""}
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="btn btn-info"
            onClick={() => {
              setSelectedEvent(p);
              setShowModal(true);
            }}
          >
            More Details
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <button
              onClick={handleAddToCart}
              disabled={!canAddMore || !p.ticketsAvailable || p.ticketsAvailable <= 0}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #111827",
                background: !canAddMore || !p.ticketsAvailable || p.ticketsAvailable <= 0 ? "#f3f4f6" : "white",
                color: !canAddMore || !p.ticketsAvailable || p.ticketsAvailable <= 0 ? "#9ca3af" : "#111827",
                cursor: !canAddMore || !p.ticketsAvailable || p.ticketsAvailable <= 0 ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              {!p.ticketsAvailable || p.ticketsAvailable <= 0 ? "Sold Out" : !canAddMore ? "Max in Cart" : "Add to Cart"}
            </button>

            {inCartQty > 0 && (
              <div style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>
                In cart: {inCartQty}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

  const addFromModal = () => {
    if (!selectedEvent) return;
    const item = { ...selectedEvent, quantity: Number(ticketQty) || 1 };
    const ok = addItemToCart(item);
    if (ok) {
      setShowModal(false);
    }
  };

  return (
    <Layout title={"Events"}>
      <div className="container-fluid mt-3 home-page" style={{ padding: "18px 24px" }}>
        <div
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            padding: "16px",
            background: "linear-gradient(90deg, #ffffff, #fbfbff)",
            borderRadius: 12,
            marginBottom: 20,
            boxShadow: "0 8px 30px rgba(2,6,23,0.04)",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <strong style={{ fontSize: 16 }}>Categories</strong>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {categories?.map((c) => (
                <label
                  key={c._id}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    background: "#f8fafc",
                    padding: "6px 10px",
                    borderRadius: 8,
                  }}
                >
                  <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)} />
                  <span style={{ fontSize: 14 }}>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <button
  className="btn"
  onClick={() => {
    setChecked([]);
    setRadio([]);
    setPage(1);
    getAllEvents();
  }}
  style={{
    background: "#ef4444",
    color: "white",
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  Reset Filters
</button>

            </div>
          </div>
        </div>

        <div>
          <h1 style={{ textAlign: "center", marginBottom: 18 }}>All Events</h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "stretch",
            }}
          >
            {events?.map((p) => (
              <EventCard key={p._id} p={p} />
            ))}
          </div>

          <div style={{ marginTop: 22, textAlign: "center" }}>
            {events.length < total && (
              <button
                className="btn loadmore"
                onClick={() => setPage(page + 1)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "#0ea5a4",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {loading ? "Loading..." : <>Load More <AiOutlineReload style={{ marginLeft: 8 }} /></>}
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedEvent && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">{selectedEvent.name}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-photo/${selectedEvent._id}`}
                  alt={selectedEvent.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
                <p>
                  <strong>Description:</strong>
                </p>
                <p>{selectedEvent.description}</p>

                <p style={{ marginTop: "10px" }}>
                  <strong>Price:</strong>{" "}
                  {selectedEvent.price === 0 ? "FREE" : `$${selectedEvent.price}`}
                </p>
                <p>
                  <strong>Date of Event:</strong>
                </p>
                <p>{new Date(selectedEvent.date).toDateString()}</p>
                <p>
                  <strong>Tickets available:</strong> {selectedEvent.ticketsAvailable ?? 0}
                </p>

                {selectedEvent.ticketsAvailable > 0 ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label>Quantity:</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedEvent.ticketsAvailable}
                      value={ticketQty}
                      onChange={(e) => {
                        const v = Math.max(1, Math.min(Number(e.target.value || 1), selectedEvent.ticketsAvailable));
                        setTicketQty(v);
                      }}
                      style={{ width: 80 }}
                    />
                  </div>
                ) : (
                  <div style={{ color: "red", fontWeight: 700 }}>Sold Out</div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>

                <button
                  className="btn btn-primary"
                  onClick={addFromModal}
                  disabled={!selectedEvent.ticketsAvailable || selectedEvent.ticketsAvailable <= 0}
                >
                  {selectedEvent.ticketsAvailable > 0 ? `Add ${ticketQty} to Cart` : "Sold Out"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Events;
