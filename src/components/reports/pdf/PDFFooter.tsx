
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Patient } from '../../../types/supabase';
import { pdfStyles } from './styles';

interface PDFFooterProps {
  patient: Patient;
}

export const PDFFooter: React.FC<PDFFooterProps> = ({ patient }) => (
  <View style={pdfStyles.footer} fixed>
    <Text>© {new Date().getFullYear()} Healz Reports - Documento confidencial | Paciente: {patient.first_name} {patient.last_name}</Text>
  </View>
);
