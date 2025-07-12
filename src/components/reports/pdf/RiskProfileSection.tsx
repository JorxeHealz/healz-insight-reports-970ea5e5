
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
        <Text>Hormonas</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.hormonas === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.hormonas === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.hormonas.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.hormonas === 'low' 
            ? 'Balance hormonal óptimo'
            : diagnosis.riskProfile.hormonas === 'medium'
            ? 'Signos de desequilibrio hormonal'
            : 'Desregulación hormonal significativa'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Vitalidad</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.vitalidad === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.vitalidad === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.vitalidad.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.vitalidad === 'low' 
            ? 'Vitalidad excelente'
            : diagnosis.riskProfile.vitalidad === 'medium'
            ? 'Vitalidad moderada'
            : 'Baja vitalidad general'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Riesgo Cardíaco</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.riesgo_cardiaco === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.riesgo_cardiaco === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.riesgo_cardiaco.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.riesgo_cardiaco === 'low' 
            ? 'Riesgo cardiovascular bajo'
            : diagnosis.riskProfile.riesgo_cardiaco === 'medium'
            ? 'Riesgo moderado'
            : 'Riesgo elevado'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Pérdida de Peso</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.perdida_peso === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.perdida_peso === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.perdida_peso.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.perdida_peso === 'low' 
            ? 'Peso saludable'
            : diagnosis.riskProfile.perdida_peso === 'medium'
            ? 'Necesidad moderada de cambios'
            : 'Requiere intervención'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Fuerza</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.fuerza === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.fuerza === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.fuerza.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.fuerza === 'low' 
            ? 'Fuerza y resistencia óptimas'
            : diagnosis.riskProfile.fuerza === 'medium'
            ? 'Capacidad física moderada'
            : 'Debilidad muscular significativa'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Salud Cerebral</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.salud_cerebral === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.salud_cerebral === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.salud_cerebral.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.salud_cerebral === 'low' 
            ? 'Función cognitiva excelente'
            : diagnosis.riskProfile.salud_cerebral === 'medium'
            ? 'Signos moderados de estrés mental'
            : 'Problemas cognitivos importantes'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Salud Sexual</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.salud_sexual === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.salud_sexual === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.salud_sexual.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.salud_sexual === 'low' 
            ? 'Salud sexual óptima'
            : diagnosis.riskProfile.salud_sexual === 'medium'
            ? 'Cambios moderados'
            : 'Disfunción significativa'}
        </Text>
      </View>
      
      <View style={pdfStyles.riskItem}>
        <Text>Longevidad</Text>
        <Text 
          style={[
            pdfStyles.riskLevel, 
            diagnosis.riskProfile.longevidad === 'low' ? pdfStyles.low :
            diagnosis.riskProfile.longevidad === 'medium' ? pdfStyles.medium : pdfStyles.high
          ]}
        >
          {diagnosis.riskProfile.longevidad.toUpperCase()}
        </Text>
        <Text style={pdfStyles.riskDescription}>
          {diagnosis.riskProfile.longevidad === 'low' 
            ? 'Excelente potencial de longevidad'
            : diagnosis.riskProfile.longevidad === 'medium'
            ? 'Factores de riesgo moderados'
            : 'Múltiples factores de riesgo'}
        </Text>
      </View>
    </View>
  </View>
);
