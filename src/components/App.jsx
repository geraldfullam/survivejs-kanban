import AltContainer from 'alt-container';
import React from 'react';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
export default class App extends React.Component {
  render () {
    const COMP_NS = 'KanbanBoard';
    return (
      <section className={COMP_NS}>
        <h1 className={`${COMP_NS}-header`}>Tasks</h1>
        <button
          className={`${COMP_NS}-addButton`}
          onClick={this.addLane}
          aria-label="Add lane"><span aria-hidden="true">+</span></button>
        <AltContainer
          stores={[LaneStore]}
          inject={{
            lanes: () => LaneStore.getState().lanes || []
          }}
        >
          <Lanes />
        </AltContainer>
      </section>
    );
  }

  addLane () {
    LaneActions.create({name: 'New lane'});
  }
}
