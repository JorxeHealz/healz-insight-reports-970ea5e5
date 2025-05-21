
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Report } from '../types/supabase';

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
          patients:patient_id (name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredReports = reports?.filter(report => 
    report.patients.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patients.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Reports">
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search patient..."
            className="w-full p-2 pl-10 border border-healz-teal/30 rounded-md focus:outline-none focus:ring-2 focus:ring-healz-teal"
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
          to="/reports/new" 
          className="bg-healz-red text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          New Report
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-red border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-healz-brown/70">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-healz-red">
          Error loading reports. Please try again.
        </div>
      ) : filteredReports?.length === 0 ? (
        <div className="text-center py-8 text-healz-brown/70">
          No reports found. Create your first report!
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-healz-brown/10">
            <thead className="bg-healz-cream/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Vitality Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Risk Score
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-healz-brown uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-healz-brown/10">
              {filteredReports?.map((report: any) => (
                <tr key={report.id} className="hover:bg-healz-cream/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-healz-brown">{report.patients.name}</div>
                    <div className="text-sm text-healz-brown/70">{report.patients.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-healz-brown/80">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-healz-green/20 text-healz-green">
                      {report.diagnosis.vitalityScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-healz-red/20 text-healz-red">
                      {report.diagnosis.riskScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/reports/${report.id}`}
                      className="text-healz-teal hover:text-healz-blue mr-4"
                    >
                      View
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
    </Layout>
  );
};

export default Reports;
