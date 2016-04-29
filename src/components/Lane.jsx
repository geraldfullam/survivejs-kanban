import AltContainer from 'alt-container';
import React from 'react';
import { DropTarget } from 'react-dnd';
import Editable from './Editable';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;
    
    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
};

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Lane extends React.Component {
  render () {
    const {connectDropTarget, lane, COMP_NS, ...props} = this.props;

    return connectDropTarget(
      <div {...props}>
        <div className={`${COMP_NS}-laneHeader`} onClick={this.activateLaneEdit}>
          <Editable COMP_NS={COMP_NS}
                    editing={lane.editing}
                    value={lane.name}
                    onEdit={this.editName}
                    onDelete={this.deleteLane} />
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesByIds(lane.notes),
            COMP_NS: 'NotesList'
          }}
        >
          <Notes
            onValueClick={this.activateNoteEdit}
            onEdit={this.editNote}
            onDelete={this.deleteNote} />
        </AltContainer>
        <button className={`${COMP_NS}-addButton`}
                onClick={this.addNote}
                aria-label="Add task">
          <span aria-hidden="true">+</span>
        </button>
      </div>
    );
  }

  editNote (id, task) {
    // Don't modify if trying to set an empty value
    if (!task.trim()) {
      NoteActions.update({id, editing: false});

      return;
    }

    NoteActions.update({id, task, editing: false});
  }

  addNote = (e) => {
    e.stopPropagation();

    const laneId = this.props.lane.id;
    const note   = NoteActions.create({task: 'New task'});

    LaneActions.attachToLane({
      noteId: note.id,
      laneId
    });
  }

  editName = (name) => {
    const laneId = this.props.lane.id;

    // Don't modify if trying to set an empty value
    if (!name.trim()) {
      LaneActions.update({id: laneId, editing: false});

      return;
    }

    LaneActions.update({id: laneId, name, editing: false});
  };

  deleteLane = () => {
    const laneId = this.props.lane.id;

    LaneActions.delete(laneId);
  };

  activateLaneEdit = () => {
    const laneId = this.props.lane.id;

    LaneActions.update({id: laneId, editing: true});
  };

  activateNoteEdit (id) {
    NoteActions.update({id, editing: true});
  }

  deleteNote = (noteId, e) => {
    // Avoid bubbling to edit
    e.stopPropagation();

    const laneId = this.props.lane.id;

    LaneActions.detachFromLane({laneId, noteId});
    NoteActions.delete(noteId);
  };
}
