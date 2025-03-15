import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCharacterStore } from '@/store/character-store';
import { Note } from '@/store/note-store';
import { usePlaceStore } from '@/store/place-store';
import { useTimelineStore } from '@/store/timeline-store';
import { Clock, User } from 'lucide-react';
import { DateAccordion } from './components/DateAccordion';
import { PlaceAccordion } from './components/PlaceAccordion';
import { TimeAccordion } from './components/TimeAccordion';
import { useGroupedNotes } from './hooks';

interface CharacterGroup {
  character: string;
  notes: Note[];
}

interface PlaceNote extends Note {
  characterName: string;
}

interface PlaceGroup {
  place: string;
  characters: {
    character: string;
    notes: PlaceNote[];
  }[];
}

const Timeline = () => {
  const { dateGroups } = useGroupedNotes();
  const { getCharacterColor } = useCharacterStore();
  const { getPlaceColor } = usePlaceStore();

  const { expandedDates, expandedTimes, expandedPlaces, toggleDate, toggleTime, togglePlace } = useTimelineStore();

  const isDateExpanded = (dateIndex: number) => expandedDates[dateIndex] !== false;
  const isTimeExpanded = (dateIndex: number, timeIndex: number) => {
    const key = `${dateIndex}-${timeIndex}`;
    return expandedTimes[key] !== false;
  };
  const isPlaceExpanded = (dateIndex: number, timeIndex: number, placeIndex: number) => {
    const key = `${dateIndex}-${timeIndex}-${placeIndex}`;
    return expandedPlaces[key] !== false;
  };

  if (dateGroups.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-gray-500 p-8'>
        <Clock className='h-12 w-12 mb-2 opacity-20' />
        <p>タイムラインに表示するデータがありません。</p>
        <p className='text-sm'>メモに時間タグをドラッグしてください。</p>
      </div>
    );
  }

  // 色を薄くする関数
  const getAlphaColor = (color: string, alpha: number = 0.2): string => {
    // HEXカラーの場合はRGBAに変換
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // すでにrgbaの場合は透明度だけ変更
    if (color.startsWith('rgba')) {
      return color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${alpha})`);
    }
    // rgbの場合はrgbaに変換
    if (color.startsWith('rgb')) {
      return color.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, `rgba($1, $2, $3, ${alpha})`);
    }
    return color;
  };

  // 場所ごとにノートをグループ化する関数
  const groupNotesByPlace = (characterGroups: CharacterGroup[]): PlaceGroup[] => {
    const placeGroups: Record<string, PlaceNote[]> = {};

    characterGroups.forEach((characterGroup) => {
      characterGroup.notes.forEach((note) => {
        const placeKey = note.place || '場所不明';
        if (!placeGroups[placeKey]) {
          placeGroups[placeKey] = [];
        }

        // キャラクター情報を含めてノートを追加
        placeGroups[placeKey].push({
          ...note,
          characterName: characterGroup.character,
        });
      });
    });

    // 場所ごとのグループを配列に変換
    return Object.entries(placeGroups).map(([place, notes]) => {
      // キャラクターごとにノートを再グループ化
      const characterGroups: Record<string, PlaceNote[]> = {};
      notes.forEach((note) => {
        const charKey = note.characterName;
        if (!characterGroups[charKey]) {
          characterGroups[charKey] = [];
        }
        characterGroups[charKey].push(note);
      });

      // キャラクターグループを配列に変換
      const characters = Object.entries(characterGroups).map(([character, notes]) => ({
        character,
        notes,
      }));

      return {
        place,
        characters,
      };
    });
  };

  return (
    <ScrollArea className='h-full pr-2'>
      <div className='space-y-3 p-2'>
        {dateGroups.map((dateGroup, dateIndex) => (
          <DateAccordion
            key={dateIndex}
            date={dateGroup.date}
            isExpanded={isDateExpanded(dateIndex)}
            onToggle={() => toggleDate(dateIndex)}
          >
            {dateGroup.timeGroups.map((timeGroup, timeIndex) => (
              <TimeAccordion
                key={timeIndex}
                time={timeGroup.time}
                isExpanded={isTimeExpanded(dateIndex, timeIndex)}
                onToggle={() => toggleTime(dateIndex, timeIndex)}
              >
                {groupNotesByPlace(timeGroup.characterGroups).map((placeGroup, placeIndex) => {
                  const placeColor = getPlaceColor(placeGroup.place);

                  return (
                    <PlaceAccordion
                      key={placeIndex}
                      place={placeGroup.place}
                      placeColor={placeColor}
                      isExpanded={isPlaceExpanded(dateIndex, timeIndex, placeIndex)}
                      onToggle={() => togglePlace(dateIndex, timeIndex, placeIndex)}
                      getAlphaColor={getAlphaColor}
                    >
                      {placeGroup.characters.map((characterGroup, charIndex) => {
                        const charColor = getCharacterColor(characterGroup.character);

                        return (
                          <div
                            key={charIndex}
                            className='mb-2 last:mb-0 p-2 rounded-md border-l-3 border'
                            style={{
                              borderLeftColor: charColor,
                              borderColor: getAlphaColor(charColor, 0.3),
                              backgroundColor: getAlphaColor(charColor, 0.1),
                            }}
                          >
                            <div className='flex items-center mb-2'>
                              <User className='h-3 w-3 mr-1' style={{ color: charColor }} />
                              <span className='text-xs font-medium text-foreground'>{characterGroup.character}</span>
                            </div>

                            <div className='space-y-2 ml-3'>
                              {characterGroup.notes.map((note, noteIndex) => (
                                <Card key={noteIndex} className='bg-background shadow-sm py-0 border'>
                                  <CardContent className='p-2 overflow-hidden'>
                                    <div className='whitespace-pre-wrap text-foreground text-xs'>{note.content}</div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </PlaceAccordion>
                  );
                })}
              </TimeAccordion>
            ))}
          </DateAccordion>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Timeline;
