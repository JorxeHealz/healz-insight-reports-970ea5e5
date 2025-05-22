
# Componentes de Informe de Salud (Health Report)

## Estructura
- `ReportDetail.tsx` - Página principal que muestra el informe
- `ReportHeader.tsx` - Encabezado con título "Informe de Salud" y botones
- `ReportTabs.tsx` - Pestañas para navegar entre secciones (Resumen, Tendencias, Comentarios)
- `ReportSummary.tsx` - Contenedor para los componentes del resumen

## Componentes de Resumen

### `VitalityScoreCard`
Muestra el puntaje de vitalidad (0-100) con un gráfico circular.
- Props: `score: number`

### `QualityOfLifeStars`
Muestra la calidad de vida con 1-5 estrellas.
- Props: `rating: 1 | 2 | 3 | 4 | 5`

### `RiskBars`
Muestra barras horizontales para diferentes categorías de riesgo.
- Props: `risks: { cardio: number, mental: number, adrenal: number, oncologic: number, metabolic: number, inflammatory: number }`

### `BiologicalAgeCard`
Muestra la edad biológica y la compara con la edad cronológica.
- Props: `biologicalAge: number, chronologicalAge: number`

### `BiomarkerStatus`
Resumen de biomarcadores por categoría (óptimo, precaución, fuera de rango).
- Props: `summary: { optimal: number, caution: number, outOfRange: number }`

### `SymptomsList`
Lista de principales síntomas y sus severidades.
- Props: `symptoms: { name: string, severity: 'low' | 'med' | 'high' }[]`

### `RecentBiomarkers`
Lista de biomarcadores recientes con su estado y tiempo desde la recolección.
- Props: `biomarkers: { name: string, valueWithUnit: string, status: 'optimal' | 'caution' | 'outOfRange', collectedAgo: string }[]`

## Codificación de colores
- Óptimo/Bueno: Verde (#86A676)
- Precaución/Regular: Amarillo (#ECBD4F) / Naranja (#E48D58)
- Fuera de rango/Malo: Rojo (#CD4631)

## Notas de Implementación
- Diseño mobile-first con breakpoint principal `md` para layout responsivo
- Componentes implementados con Tailwind CSS y Shadcn UI
- Gráficos circulares y barras implementados con Recharts
- Cada componente recibe solo las props necesarias para su funcionamiento
- Todo el código sigue TypeScript estricto
