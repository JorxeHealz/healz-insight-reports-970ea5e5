
import { Outlet, Link, useLocation } from 'react-router-dom';

export const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-healz-cream">
      <nav className="bg-white shadow-sm border-b border-healz-brown/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 text-lg font-semibold text-healz-brown">
                Healz Reports
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/patients"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/patients')
                      ? 'border-b-2 border-healz-orange text-healz-brown'
                      : 'text-healz-brown/70 hover:text-healz-brown hover:border-b-2 hover:border-healz-orange/50'
                  }`}
                >
                  Pacientes
                </Link>
                <Link
                  to="/reports"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/reports')
                      ? 'border-b-2 border-healz-orange text-healz-brown'
                      : 'text-healz-brown/70 hover:text-healz-brown hover:border-b-2 hover:border-healz-orange/50'
                  }`}
                >
                  Informes
                </Link>
                <Link
                  to="/patient-forms"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/patient-forms')
                      ? 'border-b-2 border-healz-orange text-healz-brown'
                      : 'text-healz-brown/70 hover:text-healz-brown hover:border-b-2 hover:border-healz-orange/50'
                  }`}
                >
                  Formularios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
