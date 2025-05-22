
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { supabase } from '../lib/supabase';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          patients:patient_id (first_name, last_name, email, age, gender)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  return (
    <Layout title="Detalles del Informe">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-red border-r-transparent align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Cargando...</span>
            </div>
            <p className="mt-2 text-healz-brown/70">Cargando detalles del informe...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-healz-red">
            Error al cargar el informe. Por favor, inténtalo de nuevo.
          </div>
        ) : report ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-healz-brown">
                  Paciente: {report.patients.first_name} {report.patients.last_name}
                </h2>
                <div className="text-sm text-healz-brown/70">
                  Informe creado el {new Date(report.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-healz-cream/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2 text-healz-brown">Información del Paciente</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Nombre:</span> {report.patients.first_name} {report.patients.last_name}</p>
                    <p><span className="font-medium">Email:</span> {report.patients.email}</p>
                    <p><span className="font-medium">Edad:</span> {report.patients.age}</p>
                    <p><span className="font-medium">Género:</span> {report.patients.gender}</p>
                  </div>
                </div>
                
                <div className="bg-healz-cream/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2 text-healz-brown">Perfil de Riesgo</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-white rounded shadow-sm">
                      <div className="font-medium">Cardiovascular</div>
                      <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                        ${report.diagnosis.riskProfile.cardio === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                          report.diagnosis.riskProfile.cardio === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                          'bg-healz-red/20 text-healz-red'}`}>
                        {report.diagnosis.riskProfile.cardio.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded shadow-sm">
                      <div className="font-medium">Mental</div>
                      <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                        ${report.diagnosis.riskProfile.mental === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                          report.diagnosis.riskProfile.mental === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                          'bg-healz-red/20 text-healz-red'}`}>
                        {report.diagnosis.riskProfile.mental.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded shadow-sm">
                      <div className="font-medium">Adrenal</div>
                      <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                        ${report.diagnosis.riskProfile.adrenal === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                          report.diagnosis.riskProfile.adrenal === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                          'bg-healz-red/20 text-healz-red'}`}>
                        {report.diagnosis.riskProfile.adrenal.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded shadow-sm">
                      <div className="font-medium">Metabólico</div>
                      <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                        ${report.diagnosis.riskProfile.metabolic === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                          report.diagnosis.riskProfile.metabolic === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                          'bg-healz-red/20 text-healz-red'}`}>
                        {report.diagnosis.riskProfile.metabolic.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-healz-brown">Vitality Score</h3>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-4 text-xs flex rounded-full bg-healz-green/20">
                      <div 
                        style={{ width: `${report.diagnosis.vitalityScore}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-healz-green transition-all duration-500"
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm font-semibold inline-block text-healz-green">
                        {report.diagnosis.vitalityScore}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 text-healz-brown">Risk Score</h3>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-4 text-xs flex rounded-full bg-healz-red/20">
                      <div 
                        style={{ width: `${report.diagnosis.riskScore}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-healz-red transition-all duration-500"
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm font-semibold inline-block text-healz-red">
                        {report.diagnosis.riskScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-healz-brown">Resumen</h3>
                <div className="bg-healz-cream/30 p-4 rounded-md text-healz-brown">
                  {report.diagnosis.summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
              
              {report.pdf_url && (
                <div className="mt-6 flex justify-end">
                  <a 
                    href={report.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-healz-orange text-white rounded hover:bg-opacity-90 transition-colors"
                  >
                    <svg 
                      className="mr-2 -ml-1 w-5 h-5" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M14 2v6h6" />
                      <path d="M4 14v6h16v-6" />
                      <path d="M4 14h16" />
                      <path d="M2 8v6h16V8" />
                    </svg>
                    Descargar PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-healz-brown/70">
            Informe no encontrado.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportDetail;
