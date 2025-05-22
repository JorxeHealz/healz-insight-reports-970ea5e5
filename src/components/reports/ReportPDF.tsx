
import React from 'react';
import { Document, Page, PDFDownloadLink } from '@react-pdf/renderer';
import { Patient, Diagnosis } from '../../types/supabase';
import { Button } from '@/components/ui/button';
import { pdfStyles } from './pdf/styles';
import { PDFHeader } from './pdf/PDFHeader';
import { PatientInfoSection } from './pdf/PatientInfoSection';
import { HealthIndicatorsSection } from './pdf/HealthIndicatorsSection';
import { RiskProfileSection } from './pdf/RiskProfileSection';
import { SummarySection } from './pdf/SummarySection';
import { PDFFooter } from './pdf/PDFFooter';

interface ReportPDFProps {
  patient: Patient;
  diagnosis: Diagnosis;
  date: Date;
}

// Componente PDF
export const ReportPDF = ({ patient, diagnosis, date }: ReportPDFProps) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Encabezado */}
      <PDFHeader date={date} />

      {/* Información del Paciente */}
      <PatientInfoSection patient={patient} />

      {/* Indicadores de salud */}
      <HealthIndicatorsSection diagnosis={diagnosis} />

      {/* Perfil de riesgo */}
      <RiskProfileSection diagnosis={diagnosis} />

      {/* Resumen y recomendaciones */}
      <SummarySection diagnosis={diagnosis} />

      {/* Footer */}
      <PDFFooter patient={patient} />
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
      {({ loading }) =>
        loading ? 'Generando PDF...' : 'Descargar PDF'
      }
    </PDFDownloadLink>
  </Button>
);
