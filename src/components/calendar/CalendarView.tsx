
import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppointments } from '../../hooks/useAppointments';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Phone } from 'lucide-react';
import { AppointmentDialog } from './AppointmentDialog';

// Configurar moment para español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Mensajes en español para el calendario
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay citas en este rango de fechas',
  showMore: (total: number) => `+ Ver más (${total})`,
};

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

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Calcular el rango de fechas para la consulta
  const { startDate, endDate } = useMemo(() => {
    const start = moment(currentDate).startOf(view === Views.MONTH ? 'month' : 'week').toDate();
    const end = moment(currentDate).endOf(view === Views.MONTH ? 'month' : 'week').toDate();
    return { startDate: start, endDate: end };
  }, [currentDate, view]);

  const { data: appointments = [], isLoading } = useAppointments(startDate, endDate);

  // Convertir citas a eventos del calendario
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

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
    setIsCreating(false);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({
      id: '',
      title: '',
      start,
      end,
      resource: { appointment: null, patient: null },
    });
    setIsDialogOpen(true);
    setIsCreating(true);
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'videollamada':
        return <Video className="h-3 w-3" />;
      case 'telefonica':
        return <Phone className="h-3 w-3" />;
      default:
        return <MapPin className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const appointment = event.resource.appointment;
    let backgroundColor = '#3174ad';
    
    switch (appointment?.status) {
      case 'completed':
        backgroundColor = '#10b981';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
      case 'rescheduled':
        backgroundColor = '#f59e0b';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E48D58] mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando calendario...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-[#E48D58]" />
              <CardTitle className="text-[#3A2E1C]">Calendario de Consultas</CardTitle>
            </div>
            <Button 
              onClick={() => {
                setSelectedEvent({
                  id: '',
                  title: '',
                  start: new Date(),
                  end: moment().add(1, 'hour').toDate(),
                  resource: { appointment: null, patient: null },
                });
                setIsDialogOpen(true);
                setIsCreating(true);
              }}
              className="bg-[#E48D58] hover:bg-[#CD4631] text-white"
            >
              Nueva Cita
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#3A2E1C]">
                {appointments.filter(a => a.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-500">Programadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {appointments.filter(a => a.status === 'rescheduled').length}
              </div>
              <div className="text-sm text-gray-500">Reagendadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {appointments.filter(a => a.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-500">Canceladas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario principal */}
      <Card>
        <CardContent className="p-6">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              messages={messages}
              view={view}
              onView={setView}
              date={currentDate}
              onNavigate={setCurrentDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 8, 0)} // 8:00 AM
              max={new Date(2024, 0, 1, 20, 0)} // 8:00 PM
              formats={{
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }) =>
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de citas del día */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#3A2E1C] flex items-center space-x-2">
            <Clock className="h-5 w-5 text-[#E48D58]" />
            <span>Citas de Hoy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments
              .filter(apt => moment(apt.start_time).isSame(moment(), 'day'))
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectEvent({
                    id: appointment.id,
                    title: `${appointment.patients?.first_name} ${appointment.patients?.last_name}`,
                    start: new Date(appointment.start_time),
                    end: new Date(appointment.end_time),
                    resource: { appointment, patient: appointment.patients },
                  })}
                >
                  <div className="flex items-center space-x-3">
                    {getAppointmentTypeIcon(appointment.appointment_type)}
                    <div>
                      <div className="font-medium text-[#3A2E1C]">
                        {appointment.patients?.first_name} {appointment.patients?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {moment(appointment.start_time).format('HH:mm')} - {moment(appointment.end_time).format('HH:mm')}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status === 'scheduled' && 'Programada'}
                    {appointment.status === 'completed' && 'Completada'}
                    {appointment.status === 'cancelled' && 'Cancelada'}
                    {appointment.status === 'rescheduled' && 'Reagendada'}
                  </Badge>
                </div>
              ))}
            {appointments.filter(apt => moment(apt.start_time).isSame(moment(), 'day')).length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay citas programadas para hoy</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar citas */}
      <AppointmentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        event={selectedEvent}
        isCreating={isCreating}
      />
    </div>
  );
};
