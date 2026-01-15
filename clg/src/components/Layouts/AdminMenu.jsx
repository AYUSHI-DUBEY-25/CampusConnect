import React from "react";
import { NavLink, Link } from "react-router-dom";

const AdminMenu = () => {
    return(
        <>
        <div className="text-center">
            <div className="list-group dashboard-menu">
                <h4>Admin Menu</h4>
              <NavLink
  to="/dashboard/admin/create-category"
  className="list-group-item list-group-item-action"
  style={{
    padding: "12px",
    fontWeight: 500,
    borderRadius: "6px",
    marginBottom: "8px",
  }}
>
  Create Category
</NavLink>

<NavLink
  to="/dashboard/admin/create-event"
  className="list-group-item list-group-item-action"
  style={{
    padding: "12px",
    fontWeight: 500,
    borderRadius: "6px",
    marginBottom: "8px",
  }}
>
  Create Event
</NavLink>

<NavLink
  to="/dashboard/admin/events"
  className="list-group-item list-group-item-action"
  style={{
    padding: "12px",
    fontWeight: 500,
    borderRadius: "6px",
    marginBottom: "8px",
  }}
>
  All Events
</NavLink>

<NavLink
  to="/dashboard/admin/profile"
  className="list-group-item list-group-item-action"
  style={{
    padding: "12px",
    fontWeight: 500,
    borderRadius: "6px",
  }}
>
  Profile
</NavLink>

            </div>
        </div>
        </>
    )
}
export default AdminMenu;