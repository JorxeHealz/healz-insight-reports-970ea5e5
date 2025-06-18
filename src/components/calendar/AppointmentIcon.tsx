
import React from 'react';
import { 
  PhoneCall, 
  Video, 
  UserPlus, 
  ClipboardCheck, 
  CheckSquare,
  Calendar
} from 'lucide-react';

interface AppointmentIconProps {
  type: string;
  className?: string;
}

export const AppointmentIcon: React.FC<AppointmentIconProps> = ({ type, className = "h-4 w-4" }) => {
  const getIcon = () => {
    switch (type) {
      case 'consulta_inicio':
        return <PhoneCall className={className} />;
      case 'consulta_seguimiento':
        return <Video className={className} />;
      case 'onboarding':
        return <UserPlus className={className} />;
      case 'seguimiento':
        return <ClipboardCheck className={className} />;
      case 'tareas':
        return <CheckSquare className={className} />;
      default:
        return <Calendar className={className} />;
    }
  };

  return getIcon();
};

export const getAppointmentTypeColor = (type: string) => {
  switch (type) {
    case 'consulta_inicio':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'consulta_seguimiento':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'onboarding':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'seguimiento':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'tareas':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getAppointmentTypeLabel = (type: string) => {
  switch (type) {
    case 'consulta_inicio':
      return 'Consulta Inicio';
    case 'consulta_seguimiento':
      return 'Consulta Seguimiento';
    case 'onboarding':
      return 'Onboarding Cliente';
    case 'seguimiento':
      return 'Seguimiento';
    case 'tareas':
      return 'Tareas Cliente';
    default:
      return 'Consulta';
  }
};
