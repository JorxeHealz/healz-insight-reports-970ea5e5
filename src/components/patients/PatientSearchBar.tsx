
import React from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface PatientSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export const PatientSearchBar = ({ searchTerm, onSearchChange, resultCount }: PatientSearchBarProps) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-healz-brown/50" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-healz-brown/20 focus:border-healz-teal"
        />
      </div>
      {searchTerm && (
        <p className="text-sm text-healz-brown/70">
          {resultCount} paciente{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
