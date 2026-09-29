import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Crop Diagnostics", path: "/diagnose" },
    { label: "Regenerative Advisory", path: "/advisory" },
    { label: "Knowledge Exchange", path: "/knowledge" },
    { label: "BRICS Network", path: "/network" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>KrishiSetu</h2>
        <span>Agricultural Intelligence</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;