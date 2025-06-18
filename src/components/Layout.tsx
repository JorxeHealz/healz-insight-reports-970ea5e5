
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Calendar as CalendarIcon,
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Pacientes", href: "/patients", icon: Users },
  { name: "Calendario", href: "/calendar", icon: CalendarIcon },
  { name: "Informes", href: "/reports", icon: FileText },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Header horizontal */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-[#E48D58] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold text-[#3A2E1C]">Healz</span>
              </Link>
            </div>

            {/* Navegación horizontal */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== "/" && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-[#E48D58] text-white"
                        : "text-[#3A2E1C] hover:bg-[#F8F6F1] hover:text-[#E48D58]"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Admin Tools */}
            <div className="flex items-center">
              <Link
                to="/cleanup"
                className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-[#E48D58] transition-colors rounded-md"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Admin Tools</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 py-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-[#E48D58] text-white"
                      : "text-[#3A2E1C] hover:bg-[#F8F6F1] hover:text-[#E48D58]"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
