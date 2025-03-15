import { ScrollArea } from '@/components/ui/scroll-area';
import { CharacterTagManager } from './character-tag-manager/CharacterTagManager';
import { DateTagManager } from './date-tag-manager/DateTagManager';
import { PlaceTagManager } from './place-tag-manager/PlaceTagManager';
import { TimeTagManager } from './time-tag-manager/TimeTagManger';

const TagManager = () => {
  return (
    <div className='flex flex-col h-full'>
      <ScrollArea className='flex-1 max-h-[calc(100vh-12rem)]'>
        <CharacterTagManager />

        <PlaceTagManager />

        <TimeTagManager />

        <DateTagManager />
      </ScrollArea>
    </div>
  );
};

export default TagManager;
