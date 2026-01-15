import React from "react";
import Layout from "../../components/Layouts/Layout";
import Usermenu from "../../components/Layouts/UserMenu";
import { useAuth } from "../../context/auth";

const UserDashboard = () => {
  const { auth } = useAuth();

  return (
    <Layout>
      {/* INLINE CSS */}
      <style>
        {`
          .dashboard-page {
            background: linear-gradient(to bottom right, #fafafa, #ffeef5);
            min-height: 100vh;
            padding: 30px;
          }

          .dashboard-container {
            background: #ffffff;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0px 6px 20px rgba(0,0,0,0.08);
            border: 1px solid #f2f2f2;
          }

          .user-info-box {
            background: #fff0f7;
            padding: 20px;
            border-radius: 14px;
            border: 1px solid #ffd9e8;
            box-shadow: 0px 4px 12px rgba(216,27,96,0.1);
          }

          .user-info-box h1 {
            font-size: 20px;
            font-weight: 600;
            color: #ad1457;
            margin-bottom: 12px;
          }
        `}
      </style>

      <div className="dashboard-page">
        <div className="container-fluid dashboard-container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3">
              <Usermenu />
            </div>

            {/* User Info */}
            <div className="col-md-9">
              <div className="user-info-box">
                <h1>User Name: {auth?.user?.name}</h1>
                <h1>User Email: {auth?.user?.email}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
