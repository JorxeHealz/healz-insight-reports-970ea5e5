
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Report } from '../types/supabase';
import { Input } from '@/components/ui/input';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          patients:patient_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredReports = reports?.filter(report => 
    `${report.patients.first_name} ${report.patients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patients.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-72">
          <Input
            type="text"
            placeholder="Buscar paciente..."
            className="w-full p-2 pl-10 border border-healz-teal/30 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-healz-teal/60"
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <Link 
          to="/informes/nuevo" 
          className="bg-healz-red text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          Nuevo Informe
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-red border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Cargando...</span>
          </div>
          <p className="mt-2 text-healz-brown/70">Cargando informes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-healz-red">
          Error al cargar los informes. Por favor, inténtalo de nuevo.
        </div>
      ) : filteredReports?.length === 0 ? (
        <div className="text-center py-8 text-healz-brown/70">
          No se encontraron informes. ¡Crea tu primer informe!
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-healz-brown/10">
            <thead className="bg-healz-cream/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Paciente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Vitality Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Risk Score
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-healz-brown/10">
              {filteredReports?.map((report: any) => (
                <tr key={report.id} className="hover:bg-healz-cream/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-healz-brown">{report.patients.first_name} {report.patients.last_name}</div>
                    <div className="text-sm text-healz-brown/70">{report.patients.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-healz-brown/80">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-healz-green/20 text-healz-green">
                      {report.vitality_score || 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-healz-red/20 text-healz-red">
                      {report.average_risk || 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/informes/${report.id}`}
                      className="text-healz-teal hover:text-healz-blue mr-4"
                    >
                      Ver
                    </Link>
                    {report.pdf_url && (
                      <a 
                        href={report.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-healz-orange hover:text-healz-red"
                      >
                        PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
