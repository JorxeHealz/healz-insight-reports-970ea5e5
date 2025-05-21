
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-healz-brown">Welcome to Healz Reports</h1>
        <p className="text-xl mb-8 text-healz-brown/80">
          Generate comprehensive clinical reports based on patient biomarkers,
          symptoms, and questionnaire responses.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/reports" 
            className="bg-healz-teal text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
          >
            View Reports
          </Link>
          <Link 
            to="/reports/new" 
            className="bg-healz-red text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Create New Report
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
