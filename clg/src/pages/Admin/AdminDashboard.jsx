import React from "react";
import Layout from "../../components/Layouts/Layout";
import AdminMenu from "../../components/Layouts/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const { auth } = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu/>
          </div>
          <div className="col-md-9">
            <div
  style={{
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  }}
>

  <h2 className="mb-4">Admin Profile</h2>

  <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
    
    {/* Admin Avatar */}
    <div>
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="Admin Avatar"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #0d6efd",
        }}
      />
    </div>

    {/* Profile Details */}
    <div>
      <h4 style={{ marginBottom: "8px" }}>{auth?.user?.name || "Admin User"}</h4>
      <p style={{ margin: 0, fontSize: "15px" }}>
        <strong>Email:</strong> {auth?.user?.email}
      </p>
      <p style={{ margin: 0, fontSize: "15px" }}>
        <strong>Phone:</strong> {auth?.user?.phone || "Not Provided"}
      </p>
      <p style={{ margin: 0, fontSize: "15px" }}>
        <strong>Role:</strong> {auth?.user?.role === 1 ? "Admin" : "User"}
      </p>
    </div>

  </div>

</div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;