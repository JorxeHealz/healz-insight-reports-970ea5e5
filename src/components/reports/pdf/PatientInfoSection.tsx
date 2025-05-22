
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Patient } from '../../../types/supabase';
import { pdfStyles } from './styles';

interface PatientInfoSectionProps {
  patient: Patient;
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ patient }) => (
  <View style={pdfStyles.section}>
    <Text style={pdfStyles.sectionTitle}>Información del Paciente</Text>
    <View style={pdfStyles.row}>
      <View style={pdfStyles.column}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Nombre:</Text>
          <Text>{patient.first_name} {patient.last_name}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Email:</Text>
          <Text>{patient.email}</Text>
        </View>
      </View>
      <View style={pdfStyles.column}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Edad:</Text>
          <Text>{patient.age} años</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Género:</Text>
          <Text>{patient.gender}</Text>
        </View>
      </View>
    </View>
  </View>
);
