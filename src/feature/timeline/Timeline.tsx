import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCharacterStore } from '@/store/character-store';
import { Note } from '@/store/note-store';
import { usePlaceStore } from '@/store/place-store';
import { useTimelineStore } from '@/store/timeline-store';
import { CalendarDays, ChevronDown, ChevronRight, Clock, MapPin, User } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <Clock className="h-12 w-12 mb-2 opacity-20" />
        <p>タイムラインに表示するデータがありません。</p>
        <p className="text-sm">メモに時間タグをドラッグしてください。</p>
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
    <ScrollArea className="h-full pr-2">
      <div className="space-y-3 p-2">
        {dateGroups.map((dateGroup, dateIndex) => (
          <div
            key={dateIndex}
            className="bg-card rounded-lg border-2 border-primary/60 overflow-hidden shadow-lg mb-6 last:mb-0"
          >
            <div
              className="flex items-center justify-between p-3 bg-primary/40 cursor-pointer sticky top-0 z-10"
              onClick={() => toggleDate(dateIndex)}
            >
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-primary-foreground" />
                <span className="font-bold text-primary-foreground text-lg">{dateGroup.date}</span>
              </div>
              {isDateExpanded(dateIndex) ? (
                <ChevronDown className="h-5 w-5 text-primary-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-primary-foreground" />
              )}
            </div>

            {isDateExpanded(dateIndex) && (
              <div className="p-4 space-y-4 bg-card">
                {dateGroup.timeGroups.map((timeGroup, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="bg-muted rounded-md border-l-4 border border-secondary overflow-hidden shadow-md"
                  >
                    <div
                      className="flex items-center justify-between p-3 bg-secondary cursor-pointer"
                      onClick={() => toggleTime(dateIndex, timeIndex)}
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-secondary-foreground" />
                        <span className="font-semibold text-secondary-foreground text-sm">{timeGroup.time}</span>
                      </div>
                      {isTimeExpanded(dateIndex, timeIndex) ? (
                        <ChevronDown className="h-4 w-4 text-secondary-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-secondary-foreground" />
                      )}
                    </div>

                    {isTimeExpanded(dateIndex, timeIndex) && (
                      <div className="p-3 space-y-3 bg-background">
                        {groupNotesByPlace(timeGroup.characterGroups).map((placeGroup, placeIndex) => {
                          const placeColor = getPlaceColor(placeGroup.place);

                          return (
                            <div
                              key={placeIndex}
                              className="rounded-md border-l-4 border overflow-hidden shadow-sm"
                              style={{ borderLeftColor: placeColor, borderColor: getAlphaColor(placeColor, 0.3) }}
                            >
                              <div
                                className="flex items-center justify-between p-2 cursor-pointer"
                                style={{ backgroundColor: getAlphaColor(placeColor, 0.1) }}
                                onClick={() => togglePlace(dateIndex, timeIndex, placeIndex)}
                              >
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" style={{ color: placeColor }} />
                                  <span className="text-sm font-medium text-foreground">{placeGroup.place}</span>
                                </div>
                                {isPlaceExpanded(dateIndex, timeIndex, placeIndex) ? (
                                  <ChevronDown className="h-4 w-4 text-foreground/70" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-foreground/70" />
                                )}
                              </div>

                              {isPlaceExpanded(dateIndex, timeIndex, placeIndex) && (
                                <div className="p-2 space-y-2 bg-background/95">
                                  {placeGroup.characters.map((characterGroup, charIndex) => {
                                    const charColor = getCharacterColor(characterGroup.character);

                                    return (
                                      <div
                                        key={charIndex}
                                        className="mb-2 last:mb-0 p-2 rounded-md border-l-3 border"
                                        style={{
                                          borderLeftColor: charColor,
                                          borderColor: getAlphaColor(charColor, 0.3),
                                          backgroundColor: getAlphaColor(charColor, 0.1),
                                        }}
                                      >
                                        <div className="flex items-center mb-2">
                                          <User className="h-3 w-3 mr-1" style={{ color: charColor }} />
                                          <span className="text-xs font-medium text-foreground">
                                            {characterGroup.character}
                                          </span>
                                        </div>

                                        <div className="space-y-2 ml-3">
                                          {characterGroup.notes.map((note, noteIndex) => (
                                            <Card key={noteIndex} className="bg-background shadow-sm py-0 border">
                                              <CardContent className="p-2 overflow-hidden">
                                                <div className="whitespace-pre-wrap text-foreground text-xs">
                                                  {note.content}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Timeline;
