import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface TimelineAccordionProps {
  isExpanded: boolean;
  onToggle: () => void;
  header: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

export const TimelineAccordion = ({
  isExpanded,
  onToggle,
  header,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  style,
  headerStyle,
}: TimelineAccordionProps) => {
  return (
    <div className={className} style={style}>
      <div
        className={`flex items-center justify-between cursor-pointer ${headerClassName}`}
        onClick={onToggle}
        style={headerStyle}
      >
        {header}
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </div>
      {isExpanded && <div className={contentClassName}>{children}</div>}
    </div>
  );
};
