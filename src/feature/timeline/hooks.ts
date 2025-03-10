import { Note, useNotesStore } from '@/store/note-store';

export const useGroupedNotes = (): {
  dateGroups: {
    date: string;
    timeGroups: {
      time: string;
      characterGroups: {
        character: string;
        notes: Note[];
      }[];
    }[];
  }[];
} => {
  const { notes } = useNotesStore();

  // 日付ごとにグルーピング
  const groupedByDate: Record<string, Note[]> = {};

  notes.forEach((note) => {
    const dateKey = note.date || '日付不明';
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(note);
  });

  // 階層構造を構築
  const dateGroups = Object.entries(groupedByDate).map(([date, dateNotes]) => {
    // 時間ごとにグルーピング
    const groupedByTime: Record<string, Note[]> = {};

    dateNotes.forEach((note) => {
      const timeKey = note.time || '--:--';
      if (!groupedByTime[timeKey]) {
        groupedByTime[timeKey] = [];
      }
      groupedByTime[timeKey].push(note);
    });

    const timeGroups = Object.entries(groupedByTime)
      .sort(([timeA], [timeB]) => {
        // '--:--'は常に最後に表示
        if (timeA === '--:--') return 1;
        if (timeB === '--:--') return -1;
        return timeA.localeCompare(timeB);
      })
      .map(([time, timeNotes]) => {
        const groupedByCharacter: Record<string, Note[]> = {};

        timeNotes.forEach((note) => {
          const characterKey = note.character || 'キャラクター不明';
          if (!groupedByCharacter[characterKey]) {
            groupedByCharacter[characterKey] = [];
          }
          groupedByCharacter[characterKey].push(note);
        });

        // キャラクターグループを昇順でソート
        const characterGroups = Object.entries(groupedByCharacter)
          .sort(([charA], [charB]) => charA.localeCompare(charB))
          .map(([character, notes]) => ({
            character,
            notes,
          }));

        return {
          time,
          characterGroups,
        };
      });

    return {
      date,
      timeGroups,
    };
  });

  return { dateGroups };
};
