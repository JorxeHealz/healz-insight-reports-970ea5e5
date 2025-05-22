
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Diagnosis } from '../../../types/supabase';
import { pdfStyles } from './styles';

interface SummarySectionProps {
  diagnosis: Diagnosis;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ diagnosis }) => (
  <View style={pdfStyles.section}>
    <Text style={pdfStyles.sectionTitle}>Resumen y Recomendaciones</Text>
    <View style={pdfStyles.recommendationBox}>
      {diagnosis.summary.split('\n').map((paragraph, i) => (
        <Text key={i} style={pdfStyles.paragraph}>{paragraph}</Text>
      ))}
    </View>
    
    <Text style={pdfStyles.recommendationTitle}>Recomendaciones Específicas:</Text>
    <View style={pdfStyles.recommendationList}>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.recommendationBullet}>•</Text>
        <Text style={pdfStyles.recommendationItem}>Análisis de seguimiento en 3-6 meses para biomarcadores principales</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.recommendationBullet}>•</Text>
        <Text style={pdfStyles.recommendationItem}>Evaluación de respuesta a intervenciones nutricionales</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.recommendationBullet}>•</Text>
        <Text style={pdfStyles.recommendationItem}>Monitoreo de patrones de estrés y calidad de sueño</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.recommendationBullet}>•</Text>
        <Text style={pdfStyles.recommendationItem}>Optimización de niveles hormonales según hallazgos actuales</Text>
      </View>
    </View>
  </View>
);
