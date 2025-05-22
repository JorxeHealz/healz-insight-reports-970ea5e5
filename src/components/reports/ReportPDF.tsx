
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Patient, Diagnosis } from '../../types/supabase';
import { Button } from '@/components/ui/button';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottom: '1px solid #E48D58',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A2E1C',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#5E8F8F',
  },
  badge: {
    padding: '4 8',
    borderRadius: 4,
    backgroundColor: '#F8F6F1',
    borderColor: '#E48D58',
    borderWidth: 1,
    fontSize: 10,
    color: '#3A2E1C',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3A2E1C',
    marginBottom: 10,
    borderBottom: '1px solid #E48D58',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  scoreContainer: {
    marginVertical: 5,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  scoreBarContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  vitalityScoreBar: {
    height: 10,
    backgroundColor: '#86A676',
    borderRadius: 5,
  },
  riskScoreBar: {
    height: 10,
    backgroundColor: '#CD4631',
    borderRadius: 5,
  },
  riskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  riskItem: {
    width: '48%',
    marginBottom: 10,
    marginRight: '2%',
    padding: 8,
    backgroundColor: '#F8F6F1',
    borderRadius: 5,
  },
  riskLevel: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 5,
    fontSize: 10,
  },
  low: {
    backgroundColor: '#E3F0E3',
    color: '#69A042',
  },
  medium: {
    backgroundColor: '#FFF3D4',
    color: '#D9A441',
  },
  high: {
    backgroundColor: '#FADADB',
    color: '#CF0A0A',
  },
  footer: {
    marginTop: 30,
    padding: 10,
    fontSize: 10,
    textAlign: 'center',
    color: '#999',
  },
  summary: {
    marginTop: 15,
    lineHeight: 1.5,
  },
  paragraph: {
    marginBottom: 8,
    fontSize: 11,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryItem: {
    width: '31%',
    marginBottom: 8,
    marginRight: '2%',
    padding: 6,
    backgroundColor: '#F8F6F1',
    borderRadius: 4,
    fontSize: 10,
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  recommendationList: {
    marginLeft: 15,
  },
  recommendationItem: {
    fontSize: 11,
    marginBottom: 4,
  },
  recommendationBullet: {
    marginRight: 5,
  },
  recommendationBox: {
    backgroundColor: '#F8F6F1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  riskDescription: {
    fontSize: 10,
    marginTop: 5,
    color: '#666',
  }
});

interface ReportPDFProps {
  patient: Patient;
  diagnosis: Diagnosis;
  date: Date;
}

// Componente PDF
export const ReportPDF = ({ patient, diagnosis, date }: ReportPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Informe Clínico Healz</Text>
          <Text style={styles.subtitle}>Generado el {date.toLocaleDateString()}</Text>
        </View>
        <View>
          <Text style={styles.badge}>Healz Reports</Text>
        </View>
      </View>

      {/* Información del Paciente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Paciente</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text>{patient.first_name} {patient.last_name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text>{patient.email}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>Edad:</Text>
              <Text>{patient.age} años</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Género:</Text>
              <Text>{patient.gender}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Indicadores de salud */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicadores de Salud</Text>
        
        {/* Vitality Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Vitality Score: {diagnosis.vitalityScore}%</Text>
          <View style={styles.scoreBarContainer}>
            <View style={[styles.vitalityScoreBar, { width: `${diagnosis.vitalityScore}%` }]} />
          </View>
        </View>
        
        {/* Risk Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Risk Score: {diagnosis.riskScore}%</Text>
          <View style={styles.scoreBarContainer}>
            <View style={[styles.riskScoreBar, { width: `${diagnosis.riskScore}%` }]} />
          </View>
        </View>

        {/* Categorías de Biomarcadores */}
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Categorías de Biomarcadores</Text>
          <View style={styles.categoryGrid}>
            {["Metabolic", "Heart", "Thyroid", "Stress & Aging", "Nutrients", "Immune"].map((category) => (
              <View key={category} style={styles.categoryItem}>
                <Text>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Perfil de riesgo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil de Riesgo</Text>
        <View style={styles.riskGrid}>
          <View style={styles.riskItem}>
            <Text>Cardiovascular</Text>
            <Text 
              style={[
                styles.riskLevel, 
                diagnosis.riskProfile.cardio === 'low' ? styles.low :
                diagnosis.riskProfile.cardio === 'medium' ? styles.medium : styles.high
              ]}
            >
              {diagnosis.riskProfile.cardio.toUpperCase()}
            </Text>
            <Text style={styles.riskDescription}>
              {diagnosis.riskProfile.cardio === 'low' 
                ? 'Riesgo cardiovascular bajo'
                : diagnosis.riskProfile.cardio === 'medium'
                ? 'Riesgo moderado'
                : 'Riesgo elevado'}
            </Text>
          </View>
          
          <View style={styles.riskItem}>
            <Text>Mental</Text>
            <Text 
              style={[
                styles.riskLevel, 
                diagnosis.riskProfile.mental === 'low' ? styles.low :
                diagnosis.riskProfile.mental === 'medium' ? styles.medium : styles.high
              ]}
            >
              {diagnosis.riskProfile.mental.toUpperCase()}
            </Text>
            <Text style={styles.riskDescription}>
              {diagnosis.riskProfile.mental === 'low' 
                ? 'Salud mental óptima'
                : diagnosis.riskProfile.mental === 'medium'
                ? 'Signos moderados de estrés'
                : 'Signos importantes de desequilibrio'}
            </Text>
          </View>
          
          <View style={styles.riskItem}>
            <Text>Adrenal</Text>
            <Text 
              style={[
                styles.riskLevel, 
                diagnosis.riskProfile.adrenal === 'low' ? styles.low :
                diagnosis.riskProfile.adrenal === 'medium' ? styles.medium : styles.high
              ]}
            >
              {diagnosis.riskProfile.adrenal.toUpperCase()}
            </Text>
            <Text style={styles.riskDescription}>
              {diagnosis.riskProfile.adrenal === 'low' 
                ? 'Función adrenal equilibrada'
                : diagnosis.riskProfile.adrenal === 'medium'
                ? 'Signos de adaptación al estrés'
                : 'Desregulación significativa'}
            </Text>
          </View>
          
          <View style={styles.riskItem}>
            <Text>Metabólico</Text>
            <Text 
              style={[
                styles.riskLevel, 
                diagnosis.riskProfile.metabolic === 'low' ? styles.low :
                diagnosis.riskProfile.metabolic === 'medium' ? styles.medium : styles.high
              ]}
            >
              {diagnosis.riskProfile.metabolic.toUpperCase()}
            </Text>
            <Text style={styles.riskDescription}>
              {diagnosis.riskProfile.metabolic === 'low' 
                ? 'Metabolismo óptimo'
                : diagnosis.riskProfile.metabolic === 'medium'
                ? 'Señales tempranas de desregulación'
                : 'Desregulación significativa'}
            </Text>
          </View>
        </View>
      </View>

      {/* Resumen y recomendaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen y Recomendaciones</Text>
        <View style={styles.recommendationBox}>
          {diagnosis.summary.split('\n').map((paragraph, i) => (
            <Text key={i} style={styles.paragraph}>{paragraph}</Text>
          ))}
        </View>
        
        <Text style={styles.recommendationTitle}>Recomendaciones Específicas:</Text>
        <View style={styles.recommendationList}>
          <View style={styles.row}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationItem}>Análisis de seguimiento en 3-6 meses para biomarcadores principales</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationItem}>Evaluación de respuesta a intervenciones nutricionales</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationItem}>Monitoreo de patrones de estrés y calidad de sueño</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationItem}>Optimización de niveles hormonales según hallazgos actuales</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text>© {new Date().getFullYear()} Healz Reports - Documento confidencial | Paciente: {patient.first_name} {patient.last_name}</Text>
      </View>
    </Page>
  </Document>
);

// Componente para renderizar y descargar el PDF
export const PDFDownloadButton = ({ patient, diagnosis }: { patient: Patient; diagnosis: Diagnosis }) => (
  <Button
    variant="outline"
    asChild
    className="border-healz-red text-healz-red hover:bg-healz-red/10"
  >
    <PDFDownloadLink
      document={<ReportPDF patient={patient} diagnosis={diagnosis} date={new Date()} />}
      fileName={`healz-report-${patient.first_name.toLowerCase()}-${patient.last_name.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generando PDF...' : 'Descargar PDF'
      }
    </PDFDownloadLink>
  </Button>
);
