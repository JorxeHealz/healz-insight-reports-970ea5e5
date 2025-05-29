
import React from 'react';
import { Card, CardContent } from '../../ui/card';

interface FormStatusDisplayProps {
  status: 'loading' | 'error' | 'not-found' | 'completed' | 'expired' | 'no-questions';
  message?: string;
  token?: string;
}

export const FormStatusDisplay = ({ status, message, token }: FormStatusDisplayProps) => {
  switch (status) {
    case 'loading':
      return (
        <div className="min-h-screen flex items-center justify-center bg-healz-cream">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
            <p className="mt-2 text-healz-brown">Cargando formulario...</p>
          </div>
        </div>
      );

    case 'error':
      return (
        <div className="min-h-screen flex items-center justify-center bg-healz-cream">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h2 className="text-xl font-semibold text-healz-red mb-2">Error al cargar formulario</h2>
              <p className="text-healz-brown/70 mb-4">
                {message || 'Ocurrió un error al cargar el formulario.'}
              </p>
              {token && (
                <p className="text-sm text-healz-brown/50">
                  Token: {token}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );

    case 'not-found':
      return (
        <div className="min-h-screen flex items-center justify-center bg-healz-cream">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h2 className="text-xl font-semibold text-healz-red mb-2">Formulario no encontrado</h2>
              <p className="text-healz-brown/70">
                El formulario que está buscando no existe o ha expirado.
              </p>
            </CardContent>
          </Card>
        </div>
      );

    case 'completed':
      return (
        <div className="min-h-screen flex items-center justify-center bg-healz-cream">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h2 className="text-xl font-semibold text-healz-green mb-2">Formulario ya completado</h2>
              <p className="text-healz-brown/70">
                Este formulario ya ha sido completado anteriormente.
              </p>
            </CardContent>
          </Card>
        </div>
      );

    case 'expired':
      return (
        <div className="min-h-screen flex items-center justify-center bg-healz-cream">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h2 className="text-xl font-semibold text-healz-red mb-2">Formulario expirado</h2>
              <p className="text-healz-brown/70">
                Este formulario ha expirado y ya no puede ser completado.
              </p>
            </CardContent>
          </Card>
        </div>
      );

    case 'no-questions':
      return (
        <div className="min-h-screen flex items-center justify-center bg-healz-cream">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h2 className="text-xl font-semibold text-healz-orange mb-2">Formulario en configuración</h2>
              <p className="text-healz-brown/70">
                Este formulario aún no tiene preguntas configuradas. Por favor, contacte con el administrador.
              </p>
            </CardContent>
          </Card>
        </div>
      );

    default:
      return null;
  }
};
