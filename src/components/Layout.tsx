
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  ClipboardList,
  BarChart3,
  Settings,
  TestTube,
  ChevronDown,
  FolderOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pacientes', href: '/pacientes', icon: Users },
  { name: 'Calendario', href: '/calendario', icon: Calendar },
];

const resourcesItems = [
  { name: 'Formularios', href: '/formularios', icon: FileText },
  { name: 'Informes', href: '/informes', icon: ClipboardList },
  { name: 'Analíticas', href: '/analiticas', icon: TestTube }
];

export function Layout() {
  const location = useLocation();

  const isResourcesActive = resourcesItems.some(item => 
    location.pathname === item.href || 
    (item.href !== '/' && location.pathname.startsWith(item.href))
  );

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

            {/* Recursos Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isResourcesActive
                      ? 'bg-healz-red/10 text-healz-red border-r-2 border-healz-red'
                      : 'text-healz-brown hover:bg-healz-cream hover:text-healz-red'
                  }`}
                >
                  <FolderOpen className="mr-3 h-5 w-5" />
                  Recursos
                  <ChevronDown className="ml-auto h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-48 bg-white shadow-lg border">
                {resourcesItems.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/' && location.pathname.startsWith(item.href));
                  
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.href}
                        className={`flex items-center px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-healz-red/10 text-healz-red font-medium'
                            : 'text-healz-brown hover:bg-healz-cream hover:text-healz-red'
                        }`}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

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
