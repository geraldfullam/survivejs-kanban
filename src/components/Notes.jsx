import React from 'react';
import Note from './Note';

export default ({notes, onEdit, onDelete, compNs}) => {
  return (
    <ul className={`${compNs}-list`}> {
      notes.map(
        (note, i) =>
          <Note
            index={i}
            key={note.id}
            task={note.task}
            onEdit={onEdit.bind(null, note.id)}
            onDelete={onDelete.bind(null, note.id)}
            compNs={compNs} />
      )
    } </ul>
  );
};
