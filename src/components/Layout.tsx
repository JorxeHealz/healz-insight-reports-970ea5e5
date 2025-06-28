
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  ClipboardList,
  BarChart3,
  Settings,
  TestTube
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pacientes', href: '/pacientes', icon: Users },
  { name: 'Formularios', href: '/formularios', icon: FileText },
  { name: 'Analíticas', href: '/analiticas', icon: TestTube },
  { name: 'Calendario', href: '/calendario', icon: Calendar },
  { name: 'Informes', href: '/informes', icon: ClipboardList },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-healz-cream">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-healz-red" />
              <span className="text-xl font-bold text-healz-brown">Healz Reports</span>
            </div>
          </div>
          
          <nav className="mt-6">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-healz-red/10 text-healz-red border-r-2 border-healz-red'
                      : 'text-healz-brown hover:bg-healz-cream hover:text-healz-red'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6">
            <Link
              to="/limpieza"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/limpieza'
                  ? 'bg-healz-red/10 text-healz-red'
                  : 'text-healz-brown/60 hover:bg-healz-cream hover:text-healz-red'
              }`}
            >
              <Settings className="mr-3 h-4 w-4" />
              Limpieza DB
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
