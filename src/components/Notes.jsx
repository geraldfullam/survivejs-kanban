import React from 'react';
import Note from './Note';
import Editable from './Editable';
import LaneActions from '../actions/LaneActions';

export default ({notes, COMP_NS, onValueClick, onEdit, onDelete}) => {
  return (
    <ul className={COMP_NS}> {
      notes.map(
        (note) =>
          <Note tabIndex="-1"
                key={ note.id }
                id={ note.id }
                className={`${COMP_NS}-listItem`}
                onMove={LaneActions.move}
          >
            <Editable
              COMP_NS={COMP_NS}
              editing={note.editing}
              value={note.task}
              onValueClick={onValueClick.bind(null, note.id)}
              onEdit={onEdit.bind(null, note.id)}
              onDelete={onDelete.bind(null, note.id)} />
          </Note>
      )
    } </ul>
  );
};
