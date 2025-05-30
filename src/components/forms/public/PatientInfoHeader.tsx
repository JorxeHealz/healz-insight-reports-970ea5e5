
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { User, Calendar, Mail, Phone } from 'lucide-react';

interface PatientInfoHeaderProps {
  patient: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
  };
}

export const PatientInfoHeader = ({ patient }: PatientInfoHeaderProps) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="mb-6 bg-healz-cream/50 border-healz-brown/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <User className="h-5 w-5 text-healz-brown" />
          <h3 className="text-lg font-semibold text-healz-brown">
            Información del Paciente
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-healz-brown">Nombre:</span>
            <span className="text-healz-brown/80">
              {patient.first_name} {patient.last_name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-healz-brown/60" />
            <span className="text-healz-brown/80">{patient.email}</span>
          </div>
          
          {patient.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-healz-brown/60" />
              <span className="text-healz-brown/80">{patient.phone}</span>
            </div>
          )}
          
          {patient.date_of_birth && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-healz-brown/60" />
              <span className="text-healz-brown/80">
                {formatDate(patient.date_of_birth)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
