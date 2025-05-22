
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from './styles';

interface PDFHeaderProps {
  date: Date;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ date }) => (
  <View style={pdfStyles.header}>
    <View style={pdfStyles.headerLeft}>
      <Text style={pdfStyles.title}>Informe Clínico Healz</Text>
      <Text style={pdfStyles.subtitle}>Generado el {date.toLocaleDateString()}</Text>
    </View>
    <View>
      <Text style={pdfStyles.badge}>Healz Reports</Text>
    </View>
  </View>
);
