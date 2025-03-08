export const TAG_TYPES = {
  CHARACTER: 'character',
  PLACE: 'place',
  TIME: 'time',
  DATE: 'date',
} as const;

export type TagType = (typeof TAG_TYPES)[keyof typeof TAG_TYPES];
