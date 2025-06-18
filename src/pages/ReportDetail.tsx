
import { useParams } from 'react-router-dom';
import { ReportDetailContent } from '../components/report/ReportDetailContent';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-healz-brown/70">ID de reporte no válido</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ReportDetailContent reportId={id} />
    </div>
  );
};

export default ReportDetail;
