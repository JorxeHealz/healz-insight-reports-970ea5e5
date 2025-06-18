
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Clock, User, Video } from 'lucide-react';
import { useUpcomingAppointments } from '../../hooks/useUpcomingAppointments';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const UpcomingConsultations = () => {
  const { data: appointments, isLoading } = useUpcomingAppointments();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-16 bg-healz-cream/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-healz-blue" />
          Próximas Consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments?.length === 0 ? (
          <div className="text-center py-8 text-healz-brown/60">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-healz-brown/30" />
            <p>No hay consultas programadas para los próximos 7 días</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments?.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border border-healz-brown/10 rounded-lg hover:bg-healz-cream/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-healz-blue/10 rounded-full">
                    <User className="h-4 w-4 text-healz-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-healz-brown">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-healz-brown/70">
                      <Clock className="h-3 w-3" />
                      {patient.next_visit && format(new Date(patient.next_visit), 'PPp', { locale: es })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Videollamada
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
