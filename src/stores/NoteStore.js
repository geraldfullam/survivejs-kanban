import alt from '../libs/alt';
import uuid from 'node-uuid';
import NoteActions from '../actions/NoteActions';
console.log('Actions', NoteActions);
class NoteStore {
  constructor () {
    this.bindActions(NoteActions);

    this.notes = [];
  }

  create (note) {
    const notes = this.notes;

    note.id = uuid.v4();

    this.setState({
      notes: notes.concat(note)
    });
  }

  update (updatedNote) {
    const id = updatedNote.id;
    const notes      = this.notes.map(note => {
      if (note.id === id) {
        // Object.assign is used to patch the note data here. It
        // mutates target (first parameter). In order to avoid that,
        // I use {} as its target and apply data on it.
        //
        // Example: {}, {a: 5, b: 3}, {a: 17} -> {a: 17, b: 3}
        //
        // You can pass as many objects to the method as you want.
        return Object.assign({}, note, updatedNote);
      }

      return note;
    });
    const focusIndex = this.notes.map(function (curr) {
      return curr.id;
    }).indexOf(id);

    this.setState({
      focusIndex: focusIndex,
      notes     : notes
    });
  }

  delete (id) {
    const notes      = this.notes.filter(note => note.id !== id);
    const focusIndex = this.notes.map(function (curr) {
      return curr.id;
    }).indexOf(id);

    this.setState({
      focusIndex: focusIndex,
      notes     : notes
    });
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
