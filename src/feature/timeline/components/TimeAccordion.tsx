import { Clock } from 'lucide-react';
import { TimelineAccordion } from './TimelineAccordion';

interface TimeAccordionProps {
  time: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const TimeAccordion = ({ time, isExpanded, onToggle, children }: TimeAccordionProps) => {
  return (
    <TimelineAccordion
      isExpanded={isExpanded}
      onToggle={onToggle}
      className="bg-muted rounded-md border-l-4 border border-secondary overflow-hidden shadow-md"
      headerClassName="p-3 bg-secondary"
      contentClassName="p-3 space-y-3 bg-background"
      header={
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-secondary-foreground" />
          <span className="font-semibold text-secondary-foreground text-sm">{time}</span>
        </div>
      }
    >
      {children}
    </TimelineAccordion>
  );
};
