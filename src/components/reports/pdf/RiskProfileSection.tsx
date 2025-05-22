
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Diagnosis } from '../../../types/supabase';
import { pdfStyles } from './styles';

interface RiskProfileSectionProps {
  diagnosis: Diagnosis;
}

export const RiskProfileSection: React.FC<RiskProfileSectionProps> = ({ diagnosis }) => (
  <View style={pdfStyles.section}>
    <Text style={pdfStyles.sectionTitle}>Perfil de Riesgo</Text>
    <View style={pdfStyles.riskGrid}>
      <View style={pdfStyles.riskItem}>
        <Text>Cardiovascular</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.cardio === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.cardio === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.cardio.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.cardio === 'low' 
            ? 'Riesgo cardiovascular bajo'
            : diagnosis.riskProfile.cardio === 'medium'
            ? 'Riesgo moderado'
            : 'Riesgo elevado'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Mental</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.mental === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.mental === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.mental.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.mental === 'low' 
            ? 'Salud mental óptima'
            : diagnosis.riskProfile.mental === 'medium'
            ? 'Signos moderados de estrés'
            : 'Signos importantes de desequilibrio'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Adrenal</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.adrenal === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.adrenal === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.adrenal.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.adrenal === 'low' 
            ? 'Función adrenal equilibrada'
            : diagnosis.riskProfile.adrenal === 'medium'
            ? 'Signos de adaptación al estrés'
            : 'Desregulación significativa'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Metabólico</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.metabolic === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.metabolic === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.metabolic.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.metabolic === 'low' 
            ? 'Metabolismo óptimo'
            : diagnosis.riskProfile.metabolic === 'medium'
            ? 'Señales tempranas de desregulación'
            : 'Desregulación significativa'}
        </Text>
      </View>
    </View>
  </View>
);
