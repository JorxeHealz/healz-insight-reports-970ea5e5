
import { useParams } from 'react-router-dom';
import { useReportData } from '../hooks/useReportData';
import { ReportDetailContent } from '../components/report/ReportDetailContent';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, isLoading, error } = useReportData(id);

  return (
    <div className="max-w-5xl mx-auto">
      <ReportDetailContent 
        report={report} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default ReportDetail;
