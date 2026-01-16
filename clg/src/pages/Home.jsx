// import React from "react";
// import Layout from "../components/Layouts/Layout";
// import event1 from '../assets/image/event1.png'
// import event2 from '../assets/image/event2.png'
// import event3 from '../assets/image/event3.png'
// import event4 from '../assets/image/event4.png'
// import drama from '../assets/image/drama.png'
// import sports from '../assets/image/sports.png'
// import dance from '../assets/image/dance.png'
// import art from '../assets/image/art.png'
// import music from '../assets/image/music.png'
// import code from '../assets/image/code.png'
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function Home() {
// const [subscriberEmail, setSubscriberEmail] = useState("");
// const [subLoading, setSubLoading] = useState(false);
// const handleSubscribe = async () => {
//   const email = subscriberEmail.trim();
//   if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
//     toast.error("Please enter a valid email.");
//     return;
//   }

//   setSubLoading(true);
//   try {
//     // use absolute backend URL
// const resp = await fetch("http://localhost:8080/api/subscribe", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ email }),
// });
//     let data = null;
//     const text = await resp.text().catch(() => "");
//     if (text) {
//       try {
//         data = JSON.parse(text);
//       } catch (err) {
//         console.warn("Subscribe: response not JSON, text:", text);
//         data = { message: text };
//       }
//     }

//     if (resp.ok) {
//       toast.success((data && data.message) || "Subscribed! Check your email.");
//       setSubscriberEmail("");
//     } else {
//       // resp not ok
//       const msg = (data && data.message) || `Subscription failed (status ${resp.status})`;
//       toast.error(msg);
//       console.error("Subscribe failed:", resp.status, data, text);
//     }
//   } catch (err) {
//     console.error("Subscribe error (network):", err);
//     toast.error("Network error. Try again later.");
//   } finally {
//     setSubLoading(false);
//   }
// };

//   return (
//     <Layout title="CampusConnect — Home">
//       <div className="main">
// <div
//   id="demo"
//   className="carousel slide"
//   data-bs-ride="carousel"
//   style={{ maxWidth: "90%", margin: "20px auto" }}
// >

//   <div className="carousel-inner">

//     {/* Slide 1 */}
//     <div className="carousel-item active">
//       <img
//         src={event1}
//         alt="Home"
//         style={{
//           width: "100%",
//           height: "500px",
//           objectFit: "cover",
//           filter: "brightness(70%)",
//           borderRadius: "12px",
//         }}
//       />

//       <div className="carousel-caption text-center">
//         <p
//           style={{
//             fontSize: "1.2rem",
//             fontWeight: 500,
//             marginTop: "10px",
//             textShadow: "0 3px 6px rgba(0,0,0,0.6)",
//           }}
//         >
//           BOOK YOUR TICKETS NOW!!
//         </p>
//          <button
//     style={{
//       padding: "10px 20px",
//       backgroundColor: "#ff6b6b",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "1rem",
//       color: "white",
//       marginTop: "15px",
//       cursor: "pointer",
//     }}
//     onClick={() => (window.location.href = "/events")}
//   >
//     More 
//   </button>
//       </div>
//     </div>

//     {/* Slide 2 */}
//     <div className="carousel-item">
//       <img
//         src={event2}
//         alt="Home"
//         style={{
//           width: "100%",
//           height: "500px",
//           objectFit: "cover",
//           filter: "brightness(70%)",
//           borderRadius: "12px",
//         }}
//       />

//       <div className="carousel-caption">

//         <p
//           style={{
//             fontSize: "1.2rem",
//             fontWeight: 500,
//             marginTop: "10px",
//             textShadow: "0 3px 6px rgba(0,0,0,0.6)",
//           }}
//         >
//           BOOK YOUR TICKETS NOW!!
//         </p>
//          <button
//     style={{
//       padding: "10px 20px",
//       backgroundColor: "#ff6b6b",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "1rem",
//       color: "white",
//       marginTop: "15px",
//       cursor: "pointer",
//     }}
//     onClick={() => (window.location.href = "/events")}
//   >
//     More 
//   </button>
//       </div>
//     </div>

// {/* Slide 3 */}
//     <div className="carousel-item active">
//       <img
//         src={event3}
//         alt="Home"
//         style={{
//           width: "100%",
//           height: "500px",
//           objectFit: "cover",
//           filter: "brightness(70%)",
//           borderRadius: "12px",
//         }}
//       />

//       <div className="carousel-caption text-center">

//         <p
//           style={{
//             fontSize: "1.2rem",
//             fontWeight: 500,
//             marginTop: "10px",
//             textShadow: "0 3px 6px rgba(0,0,0,0.6)",
//           }}
//         >
//           BOOK YOUR TICKETS NOW!!
//         </p>
//          <button
//     style={{
//       padding: "10px 20px",
//       backgroundColor: "#ff6b6b",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "1rem",
//       color: "white",
//       marginTop: "15px",
//       cursor: "pointer",
//     }}
//     onClick={() => (window.location.href = "/events")}
//   >
//     More 
//   </button>
//       </div>
//     </div>

//     {/* Slide 4 */}
//     <div className="carousel-item active">
//       <img
//         src={event4}
//         alt="Home"
//         style={{
//           width: "100%",
//           height: "500px",
//           objectFit: "cover",
//           filter: "brightness(70%)",
//           borderRadius: "12px",
//         }}
//       />

//       <div className="carousel-caption text-center">
//         <p
//           style={{
//             fontSize: "1.2rem",
//             fontWeight: 500,
//             marginTop: "10px",
//             textShadow: "0 3px 6px rgba(0,0,0,0.6)",
//           }}
//         >
//          BOOK YOUR TICKETS NOW!!
//         </p>
//          <button
//     style={{
//       padding: "10px 20px",
//       backgroundColor: "#ff6b6b",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "1rem",
//       color: "white",
//       marginTop: "15px",
//       cursor: "pointer",
//     }}
//     onClick={() => (window.location.href = "/events")}
//   >
//     More 
//   </button>
//       </div>
//     </div>
//   </div>

//   {/* Controls */}
//   <button
//     className="carousel-control-prev"
//     type="button"
//     data-bs-target="#demo"
//     data-bs-slide="prev"
//   >
//     <span
//       className="carousel-control-prev-icon"
//       style={{ filter: "invert(1)" }}
//     ></span>
//   </button>

//   <button
//     className="carousel-control-next"
//     type="button"
//     data-bs-target="#demo"
//     data-bs-slide="next"
//   >
//     <span
//       className="carousel-control-next-icon"
//       style={{ filter: "invert(1)" }}
//     ></span>
//   </button>

// </div>

// <div className="main" style={{ display: "flex" }}>
//   <div
//     className="container"
//     style={{
//       backgroundColor: "beige",
//       padding: "20px",
//       margin: "20px",
//       borderRadius: "10px",
//     }}
//   >
//     <h1>Discover Campus Events</h1>
//     <p>
//       Explore all upcoming workshops, fests, seminars, cultural nights, and
//       club activities happening across the campus.
//     </p>
//   </div>

//   <div
//     className="container"
//     style={{
//       backgroundColor: "rgb(209, 209, 189)",
//       padding: "20px",
//       margin: "20px",
//       borderRadius: "10px",
//     }}
//   >
//     <h1>Quick & Easy Registrations</h1>
//     <p>
//       Students can register for events instantly and receive updates without any
//       manual forms or long processes.
//     </p>
//   </div>

//   <div
//     className="container"
//     style={{
//       backgroundColor: "rgb(237, 237, 195)",
//       padding: "20px",
//       margin: "20px",
//       borderRadius: "10px",
//     }}
//   >
//     <h1>Tools for Organizers</h1>
//     <p>
//       Clubs and societies head can create events, manage attendees and keep everything organized effortlessly.
//     </p>
//   </div>
// </div>


// <div
//   className="flex-container"
//   style={{
//     display: "flex",
//     justifyContent: "center",
//     marginTop: "20px",
//   }}
// >
//   <div
//     className="container mt-3"
//     style={{
//       backgroundColor: "pink",
//       padding: "20px",
//       margin: "20px",
//       borderRadius: "10px",
//       width: "60%",
//     }}
//   >
//     <div id="accordion">

//       {/* Accordion Item 1 */}
//       <div className="card">
//         <div className="card-header">
//           <a className="btn" data-bs-toggle="collapse" href="#collapseOne">
//             How do I buy a ticket for an event?
//           </a>
//         </div>

//         <div
//           id="collapseOne"
//           className="collapse show"
//           data-bs-parent="#accordion"
//         >
//           <div className="card-body">
//             Browse the Events page, choose the event you want, select the ticket
//             type and quantity, then click <strong>Buy</strong>. Complete the
//             payment on the checkout page. You'll receive an e-ticket by email
//             immediately after payment.
//           </div>
//         </div>
//       </div>

//       {/* Accordion Item 2 */}
//       <div className="card">
//         <div className="card-header">
//           <a className="collapsed btn" data-bs-toggle="collapse" href="#collapseTwo">
//             What payment methods do you accept?
//           </a>
//         </div>

//         <div
//           id="collapseTwo"
//           className="collapse"
//           data-bs-parent="#accordion"
//         >
//           <div className="card-body">
//             We accept major debit/credit cards, UPI, net banking and popular
//             wallets. All payments are processed securely.
//           </div>
//         </div>
//       </div>

//       {/* Accordion Item 3 */}
//       <div className="card">
//         <div className="card-header">
//           <a className="collapsed btn" data-bs-toggle="collapse" href="#collapseThree">
//             Can I get a refund or transfer my ticket?
//           </a>
//         </div>

//         <div
//           id="collapseThree"
//           className="collapse"
//           data-bs-parent="#accordion"
//         >
//          <strong>No, tickets are non-refundable.</strong>  
//             Once a ticket is purchased, it cannot be cancelled, refunded, or
//             transferred. Please check event details carefully before buying.
//         </div>
//       </div>

//     </div>
//   </div>
// </div>


// <div
//   className="container mt-3"
//   style={{
//     padding: "20px",
//     borderRadius: "10px",
//     textAlign: "center",
//   }}
// >
//   <h2 style={{ marginBottom: "20px" }}>What Students Say</h2>

//   <div
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       gap: "20px",
//       flexWrap: "wrap",
//     }}
//   >
//     {/* Testimonial 1 */}
//     <div
//       style={{
//         width: "300px",
//         backgroundColor: "#ffe4ec",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <p style={{ fontStyle: "italic" }}>
//         “Buying event tickets has never been easier! The platform is super fast
//         and I get my e-ticket instantly.”
//       </p>
//       <h5 style={{ marginTop: "15px", fontWeight: "bold" }}>— Aditi Sharma</h5>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>B.Tech CSE</p>
//     </div>

//     {/* Testimonial 2 */}
//     <div
//       style={{
//         width: "300px",
//         backgroundColor: "#ffe9c7",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <p style={{ fontStyle: "italic" }}>
//         “I never miss any college event now. All events in one place is just
//         perfect for students!”
//       </p>
//       <h5 style={{ marginTop: "15px", fontWeight: "bold" }}>— Rohan Verma</h5>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>B.Tech AIML</p>
//     </div>

//     {/* Testimonial 3 */}
//     <div
//       style={{
//         width: "300px",
//         backgroundColor: "#e1ffd5",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <p style={{ fontStyle: "italic" }}>
//         “Our club used this platform for ticket sales — smooth process and great
//         experience for organizers too!”
//       </p>
//       <h5 style={{ marginTop: "15px", fontWeight: "bold" }}>— Mehul Singh</h5>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>Drama Society Lead</p>
//     </div>
//   </div>
// </div>


// <div
//   className="container mt-3"
//   style={{
//     padding: "20px",
//     borderRadius: "10px",
//     textAlign: "center",
//   }}
// >
//   <h2 style={{ marginBottom: "20px" }}>Featured Clubs & Organizers</h2>

//   <div
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       gap: "20px",
//       flexWrap: "wrap",
//     }}
//   >
//     {/* Club 1 */}
//     <div
//       style={{
//         width: "220px",
//         backgroundColor: "#e3f2fd",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <img
//         src={code}
//         alt="Coding Club"
//         style={{
//           width: "80px",
//           height: "80px",
//           borderRadius: "50%",
//           objectFit: "cover",
//           marginBottom: "10px",
//         }}
//       />
//       <h4>Coding Club</h4>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>
//         Hosts hackathons & technical events.
//       </p>
//     </div>

//     {/* Club 2 */}
//     <div
//       style={{
//         width: "220px",
//         backgroundColor: "#fff3cd",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <img
//         src={dance}
//         alt="Dance Society"
//         style={{
//           width: "80px",
//           height: "80px",
//           borderRadius: "50%",
//           objectFit: "cover",
//           marginBottom: "10px",
//         }}
//       />
//       <h4>Dance Society</h4>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>
//         Known for cultural & stage performances.
//       </p>
//     </div>

//     {/* Club 3 */}
//     <div
//       style={{
//         width: "220px",
//         backgroundColor: "#e8f5e9",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <img
//         src={drama}
//         alt="Drama Society"
//         style={{
//           width: "80px",
//           height: "80px",
//           borderRadius: "50%",
//           objectFit: "cover",
//           marginBottom: "10px",
//         }}
//       />
//       <h4>Drama Society</h4>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>
//         Popular for street plays & theatre events.
//       </p>
//     </div>

//     {/* Club 4 */}
//     <div
//       style={{
//         width: "220px",
//         backgroundColor: "#dcd8f7ff",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <img
//         src={music}
//         alt="Music Club"
//         style={{
//           width: "80px",
//           height: "80px",
//           borderRadius: "50%",
//           objectFit: "cover",
//           marginBottom: "10px",
//         }}
//       />
//       <h4>Music Club</h4>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>
//         Organizes concerts, open mics & DJ nights.
//       </p>
//     </div>

//  <div
//       style={{
//         width: "220px",
//         backgroundColor: "#f8fce4ff",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <img
//         src={art}
//         alt="Art Club"
//         style={{
//           width: "80px",
//           height: "80px",
//           borderRadius: "50%",
//           objectFit: "cover",
//           marginBottom: "10px",
//         }}
//       />
//       <h4>Art Club</h4>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>
//         Art n Craft.
//       </p>
//     </div>


//     <div
//       style={{
//         width: "220px",
//         backgroundColor: "#feeeffff",
//         borderRadius: "10px",
//         padding: "20px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <img
//         src={sports}
//         alt="Sports Club"
//         style={{
//           width: "80px",
//           height: "80px",
//           borderRadius: "50%",
//           objectFit: "cover",
//           marginBottom: "10px",
//         }}
//       />
//       <h4>Sports Club</h4>
//       <p style={{ fontSize: "0.9rem", color: "#555" }}>
//         Host sports events.
//       </p>
//     </div>

    
//   </div>
// </div>

// <div
//   className="container mt-3"
//   style={{
//     padding: "20px",
//     borderRadius: "10px",
//     textAlign: "center",
//     backgroundColor: "#fff5f8",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
//   }}
// >
//   <h2 style={{ marginBottom: "10px" }}>Stay Updated With New Events</h2>

//   <p style={{ color: "#444", marginBottom: "20px" }}>
//     Never miss an exciting college event again! Subscribe to get updates about 
//     upcoming fests, concerts, workshops, and ticket releases.
//   </p>

//   <div style={{
//   display: "flex",
//   justifyContent: "center",
//   gap: "10px",
//   flexWrap: "wrap",
// }}>
//   <input
//     type="email"
//     placeholder="Enter your email"
//     value={subscriberEmail}
//     onChange={(e) => setSubscriberEmail(e.target.value)}
//     style={{
//       padding: "10px 14px",
//       borderRadius: "8px",
//       border: "1px solid #ddd",
//       width: "260px",
//     }}
//   />
//       <button
//     onClick={handleSubscribe}
//     disabled={subLoading}
//     style={{
//       padding: "10px 20px",
//       borderRadius: "8px",
//       border: "none",
//       backgroundColor: "#ff6b6b",
//       color: "white",
//       cursor: subLoading ? "not-allowed" : "pointer",
//       fontWeight: "bold",
//     }}
//   >
//     {subLoading ? "Subscribing..." : "Subscribe"}
//   </button>
// </div>

//   <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "#777" }}>
//     We only send event updates. No spam.
//   </p>
// </div>
//       </div>
//     </Layout>
//   );
// }

import React, { useState } from "react";
import Layout from "../components/Layouts/Layout";
import event1 from "../assets/image/event1.png";
import event2 from "../assets/image/event2.png";
import event3 from "../assets/image/event3.png";
import event4 from "../assets/image/event4.png";
import drama from "../assets/image/drama.png";
import sports from "../assets/image/sports.png";
import dance from "../assets/image/dance.png";
import art from "../assets/image/art.png";
import music from "../assets/image/music.png";
import code from "../assets/image/code.png";
import toast from "react-hot-toast";

export default function Home() {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async () => {
    const email = subscriberEmail.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    setSubLoading(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const text = await resp.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (resp.ok) {
        toast.success(data?.message || "Subscribed!");
        setSubscriberEmail("");
      } else {
        toast.error(data?.message || "Subscription failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Try again later.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <Layout title="CampusConnect — Home">
      <div className="main">

        {/* CAROUSEL */}
        <div
          id="demo"
          className="carousel slide"
          data-bs-ride="carousel"
          style={{ maxWidth: "90%", margin: "20px auto" }}
        >
          <div className="carousel-inner">

            {[event1, event2, event3, event4].map((img, idx) => (
              <div
                key={idx}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <img
                  src={img}
                  alt="Home"
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    filter: "brightness(70%)",
                    borderRadius: "12px",
                  }}
                />

                <div className="carousel-caption text-center">
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      marginTop: "10px",
                      textShadow: "0 3px 6px rgba(0,0,0,0.6)",
                    }}
                  >
                    BOOK YOUR TICKETS NOW!!
                  </p>

                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#ff6b6b",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "white",
                      marginTop: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => (window.location.href = "/events")}
                  >
                    More
                  </button>
                </div>
              </div>
            ))}

          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              style={{ filter: "invert(1)" }}
            />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              style={{ filter: "invert(1)" }}
            />
          </button>
        </div>

        {/* INFO BOXES */}
        <div className="main" style={{ display: "flex" }}>
          <div className="container" style={{ backgroundColor: "beige", padding: 20, margin: 20, borderRadius: 10 }}>
            <h1>Discover Campus Events</h1>
            <p>Explore all upcoming workshops, fests, seminars, cultural nights, and club activities happening across the campus.</p>
          </div>

          <div className="container" style={{ backgroundColor: "rgb(209,209,189)", padding: 20, margin: 20, borderRadius: 10 }}>
            <h1>Quick & Easy Registrations</h1>
            <p>Students can register for events instantly and receive updates without any manual forms or long processes.</p>
          </div>

          <div className="container" style={{ backgroundColor: "rgb(237,237,195)", padding: 20, margin: 20, borderRadius: 10 }}>
            <h1>Tools for Organizers</h1>
            <p>Clubs and societies head can create events, manage attendees and keep everything organized effortlessly.</p>
          </div>
        </div>

        {/* SUBSCRIBE */}
        <div
          className="container mt-3"
          style={{
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            backgroundColor: "#fff5f8",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Stay Updated With New Events</h2>
          <p>Never miss an exciting college event again!</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", width: 260 }}
            />

            <button
              onClick={handleSubscribe}
              disabled={subLoading}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#ff6b6b",
                color: "white",
                fontWeight: "bold",
                cursor: subLoading ? "not-allowed" : "pointer",
              }}
            >
              {subLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          <p style={{ marginTop: 10, fontSize: "0.9rem", color: "#777" }}>
            We only send event updates. No spam.
          </p>
        </div>

      </div>
    </Layout>
  );
}
