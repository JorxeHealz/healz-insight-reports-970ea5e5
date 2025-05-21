
import { useState } from 'react';
import { Layout } from '../components/Layout';

const NewReport = () => {
  const [currentStep, setCurrentStep] = useState<'patient' | 'data' | 'diagnosis' | 'report'>('patient');

  return (
    <Layout title="Create New Report">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="mb-8">
          <ol className="flex items-center w-full">
            <li className={`flex w-full items-center ${currentStep === 'patient' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b after:border-healz-red after:border-4 after:inline-block`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'patient' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                1
              </span>
            </li>
            <li className={`flex w-full items-center ${currentStep === 'data' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b after:border-healz-red after:border-4 after:inline-block`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'data' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                2
              </span>
            </li>
            <li className={`flex w-full items-center ${currentStep === 'diagnosis' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b after:border-healz-red after:border-4 after:inline-block`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'diagnosis' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                3
              </span>
            </li>
            <li className={`flex items-center ${currentStep === 'report' ? 'text-healz-red' : 'text-healz-brown/70'}`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'report' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                4
              </span>
            </li>
          </ol>
          <div className="flex justify-between mt-2 px-2">
            <span className="text-sm font-medium">Select Patient</span>
            <span className="text-sm font-medium">Review Data</span>
            <span className="text-sm font-medium">Generate Diagnosis</span>
            <span className="text-sm font-medium">Report Preview</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-healz-brown/70">
            This page is under construction. We'll implement the multi-step report creation flow here.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NewReport;
