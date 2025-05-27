
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, FileText, User } from 'lucide-react';

type ClinicalNotesProps = {
  report: any;
};

export const ClinicalNotes: React.FC<ClinicalNotesProps> = ({ report }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(report.clinicalNotes?.[0]?.id || '');

  const selectedNote = report.clinicalNotes?.find((note: any) => note.id === selectedNoteId) || report.clinicalNotes?.[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Sidebar con historial de notas */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Historial de Notas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {report.clinicalNotes?.map((note: any) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full p-3 text-left border-b border-healz-brown/10 hover:bg-healz-cream/20 transition-colors ${
                    selectedNoteId === note.id ? 'bg-healz-cream/30 border-l-4 border-l-healz-orange' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-healz-brown/70">{note.date}</span>
                    <Badge variant="outline" className="text-xs">
                      {note.type}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-healz-brown">{note.title}</p>
                  <p className="text-xs text-healz-brown/60 mt-1">{note.author}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel principal con nota seleccionada */}
      <div className="lg:col-span-3">
        {selectedNote ? (
          <Card className="h-full">
            <CardHeader className="border-b border-healz-brown/10">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedNote.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-healz-brown/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedNote.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedNote.author}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{selectedNote.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto">
              {/* Resumen general */}
              <div className="mb-6">
                <h3 className="font-semibold text-healz-brown mb-2">Resumen</h3>
                <p className="text-sm text-healz-brown/80 leading-relaxed">
                  {selectedNote.summary}
                </p>
              </div>

              {/* Hallazgos por categorías */}
              <div className="space-y-6">
                {selectedNote.findings?.map((category: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold text-healz-brown mb-3 flex items-center gap-2">
                      {category.category}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          category.priority === 'high' ? 'bg-healz-red/20 text-healz-red' :
                          category.priority === 'medium' ? 'bg-healz-yellow/20 text-healz-orange' :
                          'bg-healz-green/20 text-healz-green'
                        }`}
                      >
                        {category.priority === 'high' ? 'Alta' : 
                         category.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                      </Badge>
                    </h3>
                    
                    <div className="bg-healz-cream/20 p-4 rounded-lg border border-healz-brown/10">
                      <p className="text-sm text-healz-brown/80 leading-relaxed mb-3">
                        {category.findings}
                      </p>
                      
                      {category.recommendations && (
                        <div>
                          <h4 className="font-medium text-healz-brown text-sm mb-2">Recomendaciones:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-healz-brown/70">
                            {category.recommendations.map((rec: string, recIndex: number) => (
                              <li key={recIndex}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent>
              <p className="text-healz-brown/60">No hay notas clínicas disponibles</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
