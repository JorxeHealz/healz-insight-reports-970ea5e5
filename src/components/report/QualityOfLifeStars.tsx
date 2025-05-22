
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface QualityOfLifeStarsProps {
  rating: 1 | 2 | 3 | 4 | 5;
}

export const QualityOfLifeStars: React.FC<QualityOfLifeStarsProps> = ({ rating }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Calidad de Vida</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon 
              key={star} 
              filled={star <= rating} 
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-center text-healz-brown/80">
          {rating === 5 ? 'Excelente' : 
           rating === 4 ? 'Muy buena' :
           rating === 3 ? 'Buena' :
           rating === 2 ? 'Regular' : 'Baja'}
        </p>
      </CardContent>
    </Card>
  );
};

interface StarIconProps {
  filled: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ filled }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#ECBD4F" : "none"}
      stroke={filled ? "#ECBD4F" : "#ECBD4F"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-all"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};
