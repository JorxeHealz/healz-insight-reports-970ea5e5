
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Diagnosis } from '../../../types/supabase';
import { pdfStyles } from './styles';

interface HealthIndicatorsSectionProps {
  diagnosis: Diagnosis;
}

export const HealthIndicatorsSection: React.FC<HealthIndicatorsSectionProps> = ({ diagnosis }) => (
  <View style={pdfStyles.section}>
    <Text style={pdfStyles.sectionTitle}>Indicadores de Salud</Text>
    
    {/* Vitality Score */}
    <View style={pdfStyles.scoreContainer}>
      <Text style={pdfStyles.scoreLabel}>Vitality Score: {diagnosis.vitalityScore}%</Text>
      <View style={pdfStyles.scoreBarContainer}>
        <View style={[pdfStyles.vitalityScoreBar, { width: `${diagnosis.vitalityScore}%` }]} />
      </View>
    </View>
    
    {/* Risk Score */}
    <View style={pdfStyles.scoreContainer}>
      <Text style={pdfStyles.scoreLabel}>Risk Score: {diagnosis.riskScore}%</Text>
      <View style={pdfStyles.scoreBarContainer}>
        <View style={[pdfStyles.riskScoreBar, { width: `${diagnosis.riskScore}%` }]} />
      </View>
    </View>

    {/* Categorías de Biomarcadores */}
    <View style={{ marginTop: 15 }}>
      <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Categorías de Biomarcadores</Text>
      <View style={pdfStyles.categoryGrid}>
        {["Metabolic", "Heart", "Thyroid", "Stress & Aging", "Nutrients", "Immune"].map((category) => (
          <View key={category} style={pdfStyles.categoryItem}>
            <Text>{category}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);
