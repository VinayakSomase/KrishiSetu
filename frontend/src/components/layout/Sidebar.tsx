import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItems = [
    {
      label: "Dashboard",
      path: "/",
    },
    {
      label: "Crop Diagnostics",
      path: "/diagnose",
    },
    {
      label: "Regenerative Advisory",
      path: "/advisory",
    },
    {
      label: "Knowledge Exchange",
      path: "/knowledge",
    },
    {
      label: "BRICS Network",
      path: "/network",
    },
  ];

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
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;