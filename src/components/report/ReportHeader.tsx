
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Download } from 'lucide-react';

export const ReportHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full hover:bg-healz-cream"
        >
          <Link to="/reports">
            <ArrowLeft className="h-5 w-5 text-healz-brown" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-healz-brown">Informe de Salud</h1>
      </div>
      
      <Button 
        variant="outline" 
        className="text-healz-brown border-healz-brown hover:bg-healz-cream"
      >
        <Download className="mr-2 h-4 w-4" />
        Descargar informe
      </Button>
    </div>
  );
};
