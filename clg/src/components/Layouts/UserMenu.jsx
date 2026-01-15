import React from "react";
import { NavLink } from "react-router-dom";

const Usermenu = () => {
  return (
    <>
      {/* INLINE CSS */}
      <style>
        {`
          .dashboard-menu {
            background: #ffffff;
            border-radius: 16px;
            padding: 20px;
            border: 1px solid #f2f2f2;
            box-shadow: 0px 6px 20px rgba(0,0,0,0.08);
            width: 100%;
          }

          .dashboard-menu h4 {
            color: #d81b60;
            font-weight: 700;
            margin-bottom: 15px;
            font-size: 20px;
          }

          .dashboard-menu .list-group-item {
            border: none;
            padding: 12px 15px;
            margin-bottom: 8px;
            border-radius: 10px;
            font-weight: 500;
            color: #6b6b6b;
            font-size: 15px;
            transition: all 0.25s ease;
            background: #fff0f7;
            border: 1px solid #ffd9e8;
          }

          /* Hover effect */
          .dashboard-menu .list-group-item:hover {
            background: #ffebf4;
            color: #ad1457;
            transform: translateX(3px);
          }

          /* Active Link */
          .dashboard-menu .active {
            background: #d81b60 !important;
            color: white !important;
            border: none !important;
            font-weight: 600;
            transform: translateX(3px);
            box-shadow: 0px 4px 12px rgba(216, 27, 96, 0.3);
          }
        `}
      </style>

      <div className="text-center">
        <div className="list-group dashboard-menu">
          <h4>User Menu</h4>

          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
          >
            Profile
          </NavLink>

          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action"
          >
            Bookings
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Usermenu;
