import { DragEvent, ReactNode } from 'react';

type DraggableTagProps = {
  children: ReactNode;
  handleDragStart: (e: DragEvent<HTMLDivElement>) => void;
  handleDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onEditTag: () => void;
  onDeleteTag: () => void;
};

export const DraggableTag = ({
  children,
  handleDragStart,
  handleDragEnd,
  onEditTag,
  onDeleteTag,
}: DraggableTagProps) => {
  return (
    <>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e)}
        onDragEnd={handleDragEnd}
        className='flex items-center gap-1 cursor-move flex-1'
      >
        {children}
      </div>

      <div className='opacity-0 group-hover:opacity-100 flex'>
        <EditTagButton onEditTag={onEditTag} />

        <DeleteTagButton onDelete={onDeleteTag} />
      </div>
    </>
  );
};

type EditTagButtonProps = {
  onEditTag: () => void;
};

const EditTagButton = ({ onEditTag }: EditTagButtonProps) => {
  return (
    <button onClick={onEditTag} className='text-gray-500 hover:text-gray-700 p-0.5'>
      <svg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M16.474 5.408L18.592 7.526L6 20.118V22H8.118L20.71 9.408L22.828 11.526L23.535 10.819L13.181 0.465L12.474 1.172L14.592 3.29L16.474 5.408ZM13.185 7.112L13.644 7.571L15.354 9.281L18.829 5.807L16.647 3.625L13.185 7.112Z'
          fill='currentColor'
        />
      </svg>
    </button>
  );
};

type DeleteTagButtonProps = {
  onDelete: () => void;
};

const DeleteTagButton = ({ onDelete }: DeleteTagButtonProps) => {
  return (
    <button onClick={onDelete} className='text-red-500 hover:text-red-700 p-0.5'>
      <svg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M20 6H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V6H4C2.9 6 2 6.9 2 8V9C2 9.6 2.4 10 3 10H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10H21C21.6 10 22 9.6 22 9V8C22 6.9 21.1 6 20 6ZM10 5H14V6H10V5ZM18 20H6V10H18V20Z'
          fill='currentColor'
        />
      </svg>
    </button>
  );
};
