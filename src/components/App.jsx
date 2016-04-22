import React from 'react';
import ReactDOM from 'react-dom';

import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

export default class App extends React.Component {
  constructor (props) {
    super(props);

    this.state      = NoteStore.getState();
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentDidMount () {
    NoteStore.listen(this.storeChanged);
  }

  componentWillUnmount () {
    NoteStore.unlisten(this.storeChanged);
  }

  componentDidUpdate () {
    console.log(this.refs.notesList.getElementsByTagName('li')[this.state.focusIndex].focus());
  }

  


  storeChanged = (state) => {
    // Without a property initializer `this` wouldn't
    // point at the right context because it defaults to
    // `undefined` in strict mode.
    this.setState(state);
  };

  render () {
    const notes  = this.state.notes;
    const compNs = 'NotesList';
    return (
      <section ref="notesList" className={compNs}>
        <h1 className={`${compNs}-header`}>Tasks</h1>
        <button className={`${compNs}-button`} onClick={this.addNote}>+</button>
        <Notes
          notes={notes}
          onEdit={this.editNote}
          onDelete={this.deleteNote}
          compNs={compNs} />
      </section>
    );
  }

  // We are using an experimental feature known as property
  // initializer here. It allows us to bind the method `this`
  // to point at our *App* instance.
  //
  // Alternatively we could `bind` at `constructor` using
  // a line, such as this.addNote = this.addNote.bind(this);
  addNote = () => {
    NoteActions.create({task: 'New task'});
  };

  deleteNote = (id, e) => {
    // Avoid bubbling to edit
    e.stopPropagation();

    NoteActions.delete(id);
  };

  editNote = (id, task) => {
    // If trimmed string is empty (falsey), just return without doing anything.
    // i.e. Don't modify if trying to set an empty value
    if (!task.trim()) {
      NoteActions.delete(id);
      return;
    }

    NoteActions.update({id, task});
  };
}
