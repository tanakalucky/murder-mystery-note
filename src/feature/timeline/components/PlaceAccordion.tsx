import { MapPin } from 'lucide-react';
import { ReactNode } from 'react';
import { TimelineAccordion } from './TimelineAccordion';

interface PlaceAccordionProps {
  place: string;
  placeColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  getAlphaColor: (color: string, alpha?: number) => string;
}

export const PlaceAccordion = ({
  place,
  placeColor,
  isExpanded,
  onToggle,
  children,
  getAlphaColor,
}: PlaceAccordionProps) => {
  return (
    <TimelineAccordion
      isExpanded={isExpanded}
      onToggle={onToggle}
      className='rounded-md border-l-4 border overflow-hidden shadow-sm'
      style={{
        borderLeftColor: placeColor,
        borderColor: getAlphaColor(placeColor, 0.3),
      }}
      headerClassName='p-2'
      headerStyle={{ backgroundColor: getAlphaColor(placeColor, 0.1) }}
      contentClassName='p-2 space-y-2 bg-background/95'
      header={
        <div className='flex items-center'>
          <MapPin className='h-4 w-4 mr-2' style={{ color: placeColor }} />
          <span className='text-sm font-medium text-foreground'>{place}</span>
        </div>
      }
    >
      {children}
    </TimelineAccordion>
  );
};
