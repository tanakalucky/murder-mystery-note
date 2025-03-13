import { CalendarDays } from 'lucide-react';
import { TimelineAccordion } from './TimelineAccordion';

interface DateAccordionProps {
  date: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const DateAccordion = ({ date, isExpanded, onToggle, children }: DateAccordionProps) => {
  return (
    <TimelineAccordion
      isExpanded={isExpanded}
      onToggle={onToggle}
      className="bg-card rounded-lg border-2 border-primary/60 overflow-hidden shadow-lg mb-6 last:mb-0"
      headerClassName="p-3 bg-primary/40 sticky top-0 z-10"
      contentClassName="p-4 space-y-4 bg-card"
      header={
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-primary-foreground" />
          <span className="font-bold text-primary-foreground text-lg">{date}</span>
        </div>
      }
    >
      {children}
    </TimelineAccordion>
  );
};
