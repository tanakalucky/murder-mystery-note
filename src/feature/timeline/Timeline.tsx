import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCharacterStore } from '@/store/character-store';
import { usePlaceStore } from '@/store/place-store';
import { Clock, MapPin } from 'lucide-react';
import { useGroupedNotes } from './hooks';

export const Timeline = () => {
  const { dateGroups } = useGroupedNotes();
  const { getCharacterColor } = useCharacterStore();
  const { getPlaceColor } = usePlaceStore();

  if (dateGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <Clock className="h-12 w-12 mb-2 opacity-20" />
        <p>タイムラインに表示するデータがありません。</p>
        <p className="text-sm">メモに時間タグをドラッグしてください。</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-3 p-2">
        {dateGroups.map((dateGroup, dateIndex) => (
          <div key={dateIndex} className="mb-6 last:mb-0">
            <div className="bg-sidebar px-4 py-2 rounded-t-md border-b-2 border-primary mb-2 sticky top-0 z-10">
              <h3 className="font-semibold text-foreground">{dateGroup.date}</h3>
            </div>

            <div className="space-y-6 relative">
              {dateGroup.timeGroups.map((timeGroup, timeIndex) => (
                <div key={timeIndex} className="mb-4 last:mb-0">
                  <div className="flex items-center mb-2">
                    <div className="bg-sidebar w-12 shrink-0 py-1 flex flex-col items-center justify-start border border-primary rounded-md">
                      <span className="font-medium text-foreground text-xs">{timeGroup.time}</span>
                    </div>
                    <div className="ml-2 h-0.5 flex-grow bg-primary"></div>
                  </div>

                  <div className="space-y-4 ml-4">
                    {timeGroup.characterGroups.map((characterGroup, charIndex) => (
                      <div key={charIndex} className="mb-3 last:mb-0">
                        <div className="flex items-center mb-1">
                          <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: getCharacterColor(characterGroup.character) }}
                          ></div>
                          <span className="text-xs font-medium text-foreground">{characterGroup.character}</span>
                        </div>

                        <div className="space-y-2 ml-3">
                          {characterGroup.notes.map((note, noteIndex) => (
                            <Card key={noteIndex} className="bg-sidebar shadow-sm py-0 border border-primary">
                              <CardContent className="p-0 overflow-hidden">
                                <div className="flex">
                                  <div className="flex-1 p-2">
                                    <div className="flex flex-wrap items-start gap-1 mb-1 text-xs">
                                      {note.place && (
                                        <div className="flex items-center">
                                          <MapPin
                                            className="h-2 w-2 mr-0.5"
                                            style={{ color: getPlaceColor(note.place) }}
                                          />
                                          <span className="text-foreground">{note.place}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="whitespace-pre-wrap text-foreground text-xs">{note.content}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
