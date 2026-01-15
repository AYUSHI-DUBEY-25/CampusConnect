import React from "react";

export default function Footer() {
  return (
    <div
      style={{
        backgroundColor: "#1f1f1f",
        color: "white",
        padding: "40px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          textAlign: "left",
        }}
      >
        {/* About Section */}
        <div style={{ width: "250px", marginBottom: "20px" }}>
          <h3>CampusEvents</h3>
          <p style={{ color: "#bbb" }}>
            Your all-in-one platform to explore, book, and experience exciting 
            college events. Get tickets instantly and stay updated always!
          </p>
        </div>

        {/* Event Categories */}
        <div style={{ width: "200px", marginBottom: "20px" }}>
          <h4>Event Categories</h4>
          <ul style={{ listStyle: "none", padding: 0, color: "#bbb" }}>
            <li style={{ marginBottom: "8px" }}>Workshops</li>
            <li style={{ marginBottom: "8px" }}>Cultural Fest</li>
            <li style={{ marginBottom: "8px" }}>Concerts & DJ Nights</li>
            <li style={{ marginBottom: "8px" }}>Tech Events</li>
          </ul>
        </div>

        {/* Contact */}
        <div style={{ width: "220px", marginBottom: "20px" }}>
          <h4>Contact</h4>
          <p style={{ color: "#bbb", marginBottom: "8px" }}>
            support@campusevents.com
          </p>
          <p style={{ color: "#bbb", marginBottom: "8px" }}>
            Instagram: @campusevents_official
          </p>
          <p style={{ color: "#bbb" }}>
            Hotline: +91 XXX XXX XXXX
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          color: "#888",
          borderTop: "1px solid #333",
          paddingTop: "15px",
        }}
      >
        © {new Date().getFullYear()} CampusEvents. All Rights Reserved.
      </div>
    </div>
  );
}
