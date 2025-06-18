
import { useParams } from 'react-router-dom';
import { ReportDetailContent } from '../components/report/ReportDetailContent';
import { Suspense } from 'react';
import { Skeleton } from '../components/ui/skeleton';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();

  console.log('ReportDetail rendering with id:', id);

  if (!id) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-healz-brown/70">ID de reporte no válido</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Suspense fallback={
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      }>
        <ReportDetailContent reportId={id} />
      </Suspense>
    </div>
  );
};

export default ReportDetail;
