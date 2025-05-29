import React, { useState } from 'react';
import { usePatientForms, useCreatePatientForm, useProcessFormWithN8N } from '../hooks/usePatientForms';
import { Plus, Copy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { CreatePatientFormDialog } from '../components/forms/CreatePatientFormDialog';
import { ProcessingStatus } from '../components/forms/ProcessingStatus';
import { QuestionsSeed } from '../components/forms/QuestionsSeed';

const PatientForms = () => {
  const { data: forms, isLoading, error } = usePatientForms();
  const createPatientForm = useCreatePatientForm();
  const processForm = useProcessFormWithN8N();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleProcessForm = async (formId: string) => {
    try {
      await processForm.mutateAsync({ form_id: formId });
      toast({
        title: "Formulario enviado a n8n",
        description: "El formulario ha sido enviado para su procesamiento."
      });
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario para su procesamiento.",
        variant: "destructive"
      });
    }
  };

return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-healz-brown">Gestión de Formularios</h1>
      <Button
        onClick={() => setIsCreateDialogOpen(true)}
        className="bg-healz-green hover:bg-healz-green/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        Crear Formulario
      </Button>
    </div>

    {/* Agregar el componente de seeding de preguntas */}
    <QuestionsSeed />

    <ProcessingStatus />

    <Card>
      <CardHeader>
        <CardTitle>Formularios Activos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
            <p className="mt-2 text-healz-brown">Cargando formularios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error al cargar formularios: {error.message}
          </div>
        ) : forms && forms.length > 0 ? (
          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {form.patient?.first_name} {form.patient?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{form.patient?.email}</p>
                    <p className="text-xs text-gray-500">
                      Creado: {new Date(form.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Expira: {new Date(form.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      form.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      form.status === 'completed' ? 'bg-green-100 text-green-800' :
                      form.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {form.status === 'pending' ? 'Pendiente' :
                       form.status === 'completed' ? 'Completado' :
                       form.status === 'processed' ? 'Procesado' : 'Expirado'}
                    </span>
                  </div>
                </div>
                
                {form.status === 'pending' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={`${window.location.origin}/form/${form.form_token}`}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/form/${form.form_token}`);
                          toast({
                            title: "URL copiada",
                            description: "La URL del formulario se ha copiado al portapapeles"
                          });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {form.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProcessForm(form.id)}
                    disabled={processForm.isPending}
                    className="w-full"
                  >
                    {processForm.isPending ? 'Procesando...' : 'Procesar con n8n'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay formularios creados
          </div>
        )}
      </CardContent>
    </Card>

    <CreatePatientFormDialog
      open={isCreateDialogOpen}
      onOpenChange={setIsCreateDialogOpen}
      onCreateSuccess={() => {
        setIsCreateDialogOpen(false);
        toast({
          title: "Formulario creado",
          description: "El formulario ha sido creado correctamente."
        });
      }}
      onCreateError={(error: Error) => {
        toast({
          title: "Error",
          description: `No se pudo crear el formulario: ${error.message}`,
          variant: "destructive"
        });
      }}
    />
  </div>
);
};

export default PatientForms;
