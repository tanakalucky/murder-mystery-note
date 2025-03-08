import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCharacterStore } from '@/store/character-store';
import { usePlaceStore } from '@/store/place-store';
import { Clock, MapPin } from 'lucide-react';
import { useGroupedByDateNotes } from './hooks';

export const Timeline = () => {
  const groupedByDateNotes = useGroupedByDateNotes();
  const { getCharacterColor } = useCharacterStore();
  const { getPlaceColor } = usePlaceStore();

  if (Object.keys(groupedByDateNotes).length === 0) {
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
        {Object.entries(groupedByDateNotes).map(([date, dateNotes], dateIndex) => (
          <div key={dateIndex} className="mb-6 last:mb-0">
            <div className="bg-gray-100 px-4 py-2 rounded-t-md border-b-2 border-gray-300 mb-2 sticky top-0 z-10">
              <h3 className="font-semibold text-gray-800">{date}</h3>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-8 top-8 bottom-4 border-l-2 border-dashed border-gray-200 -z-10"></div>
              {dateNotes.map((note, index) => (
                <Card key={index} className="bg-white shadow-sm py-0">
                  <CardContent className="p-0 overflow-hidden">
                    <div className="flex">
                      <div className="bg-gray-50 w-12 shrink-0 py-2 flex flex-col items-center justify-start border-r">
                        <span className="font-medium text-gray-700 text-xs">{note.time}</span>
                      </div>
                      <div className="flex-1 p-2">
                        <div className="flex flex-wrap items-start gap-1 mb-1 text-xs">
                          {note.character && (
                            <div className="flex items-center mr-1.5">
                              <div
                                className="w-2 h-2 rounded-full mr-0.5"
                                style={{ backgroundColor: getCharacterColor(note.character) }}
                              ></div>
                              <span>{note.character}</span>
                            </div>
                          )}
                          {note.place && (
                            <div className="flex items-center">
                              <MapPin className="h-2 w-2 mr-0.5" style={{ color: getPlaceColor(note.place) }} />
                              <span>{note.place}</span>
                            </div>
                          )}
                        </div>
                        <div className="whitespace-pre-wrap text-gray-700 text-xs">{note.content}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
