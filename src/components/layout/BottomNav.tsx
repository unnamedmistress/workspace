import { useLocation, useNavigate } from "react-router-dom";
import { Home, Plus, Settings, FileText } from "lucide-react";

// Check if we're in production (you can also use an env variable)
const isProduction = import.meta.env.PROD;

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/new", icon: Plus, label: "New Job" },
  // Only show Demo in development, or relabel as "Examples" in production
  { path: "/demo", icon: FileText, label: isProduction ? "Examples" : "Demo", showInProd: true },
  { path: "/settings", icon: Settings, label: "Settings" },
].filter(item => !isProduction || item.showInProd !== false);

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on wizard and preview pages
  if (location.pathname.startsWith("/wizard") || location.pathname.startsWith("/preview")) {
    return null;
  }

  const handleNavClick = (path: string) => {
    // Add haptic feedback
    navigator.vibrate?.(10);
    navigate(path);
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => handleNavClick(path)}
            className={`bottom-nav-item ${isActive ? "active" : ""} focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset`}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
