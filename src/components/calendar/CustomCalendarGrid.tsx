
import React, { useState, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { useAppointments } from '../../hooks/useAppointments';
import { AppointmentIcon, getAppointmentTypeColor, getAppointmentTypeLabel } from './AppointmentIcon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

moment.locale('es');

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    appointment: any;
    patient: any;
  };
}

interface CustomCalendarGridProps {
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

export const CustomCalendarGrid: React.FC<CustomCalendarGridProps> = ({
  onSelectEvent,
  onSelectSlot,
}) => {
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
  const [viewWeeks, setViewWeeks] = useState(3); // Mostrar 3 semanas por defecto

  // Calcular el rango de fechas
  const { startDate, endDate } = useMemo(() => {
    const start = currentWeek.clone().toDate();
    const end = currentWeek.clone().add(viewWeeks, 'weeks').toDate();
    return { startDate: start, endDate: end };
  }, [currentWeek, viewWeeks]);

  const { data: appointments = [], isLoading } = useAppointments(startDate, endDate);

  // Convertir citas a eventos
  const events: CalendarEvent[] = useMemo(() => {
    return appointments.map((appointment) => ({
      id: appointment.id,
      title: `${appointment.patients?.first_name} ${appointment.patients?.last_name}`,
      start: new Date(appointment.start_time),
      end: new Date(appointment.end_time),
      resource: {
        appointment,
        patient: appointment.patients,
      },
    }));
  }, [appointments]);

  // Generar las semanas a mostrar
  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < viewWeeks; i++) {
      const weekStart = currentWeek.clone().add(i, 'weeks');
      const days = [];
      for (let j = 0; j < 7; j++) {
        days.push(weekStart.clone().add(j, 'days'));
      }
      weeksArray.push({ weekStart, days });
    }
    return weeksArray;
  }, [currentWeek, viewWeeks]);

  // Generar slots de tiempo (8:00 - 20:00, cada 30 min)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  const handleSlotClick = (day: moment.Moment, timeSlot: string) => {
    const [hour, minute] = timeSlot.split(':').map(Number);
    const start = day.clone().hour(hour).minute(minute).toDate();
    const end = day.clone().hour(hour).minute(minute + 30).toDate();
    onSelectSlot({ start, end });
  };

  const getEventsForSlot = (day: moment.Moment, timeSlot: string) => {
    const [hour, minute] = timeSlot.split(':').map(Number);
    const slotStart = day.clone().hour(hour).minute(minute);
    const slotEnd = slotStart.clone().add(30, 'minutes');
    
    return events.filter(event => {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);
      return eventStart.isBefore(slotEnd) && eventEnd.isAfter(slotStart);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E48D58] mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* Header de navegación */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev.clone().subtract(1, 'week'))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-[#3A2E1C]">
            {currentWeek.format('MMMM YYYY')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev.clone().add(1, 'week'))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewWeeks === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setViewWeeks(1)}
          >
            1 Semana
          </Button>
          <Button
            variant={viewWeeks === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setViewWeeks(3)}
          >
            3 Semanas
          </Button>
          <Button
            variant={viewWeeks === 5 ? "default" : "outline"}
            size="sm"
            onClick={() => setViewWeeks(5)}
          >
            5 Semanas
          </Button>
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header con los días */}
          <div className="grid grid-cols-8 border-b bg-gray-50">
            <div className="p-2 text-sm font-medium text-gray-500 border-r">Hora</div>
            {weeks[0]?.days.map((day, index) => (
              <div key={index} className="p-2 text-center border-r last:border-r-0">
                <div className="text-sm font-medium text-[#3A2E1C]">
                  {day.format('ddd')}
                </div>
                <div className="text-lg font-semibold text-[#3A2E1C]">
                  {day.format('D')}
                </div>
              </div>
            ))}
          </div>

          {/* Filas de tiempo */}
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b hover:bg-gray-50">
              <div className="p-2 text-sm text-gray-500 border-r bg-gray-50">
                {timeSlot}
              </div>
              {weeks[0]?.days.map((day, dayIndex) => {
                const slotEvents = getEventsForSlot(day, timeSlot);
                return (
                  <div
                    key={dayIndex}
                    className="relative p-1 border-r last:border-r-0 min-h-[60px] cursor-pointer hover:bg-blue-50"
                    onClick={() => handleSlotClick(day, timeSlot)}
                  >
                    {slotEvents.map((event) => (
                      <div
                        key={event.id}
                        className="mb-1 p-1 rounded text-xs cursor-pointer hover:shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(event);
                        }}
                      >
                        <Badge 
                          className={`${getAppointmentTypeColor(event.resource.appointment.appointment_type)} w-full justify-start text-xs`}
                        >
                          <AppointmentIcon 
                            type={event.resource.appointment.appointment_type} 
                            className="h-3 w-3 mr-1" 
                          />
                          <span className="truncate">
                            {event.title}
                          </span>
                        </Badge>
                      </div>
                    ))}
                    {slotEvents.length === 0 && (
                      <div className="opacity-0 hover:opacity-100 flex items-center justify-center h-full">
                        <Plus className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda de tipos */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-4 text-sm">
          {['consulta_inicio', 'consulta_seguimiento', 'onboarding', 'seguimiento', 'tareas'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <AppointmentIcon type={type} className="h-4 w-4" />
              <span className="text-gray-600">{getAppointmentTypeLabel(type)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
