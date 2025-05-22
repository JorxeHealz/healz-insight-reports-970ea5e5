
import { StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
export const pdfStyles = StyleSheet.create({
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
