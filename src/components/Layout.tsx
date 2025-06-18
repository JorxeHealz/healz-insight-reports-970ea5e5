
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
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
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 shrink-0 items-center px-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-[#E48D58] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-[#3A2E1C]">Healz</span>
          </Link>
        </div>
        
        <nav className="mt-8 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <li key={item.name}>
                  <Link
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
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Link
            to="/cleanup"
            className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-[#E48D58] transition-colors"
          >
            <Settings className="mr-3 h-4 w-4" />
            Admin Tools
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="pl-64">
        <main className="py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
