import React from 'react';
import Lane from './Lane.jsx';

export default ({lanes}) => {
  const COMP_NS = 'LanesList';
  return (
    <div className={COMP_NS}>{lanes.map(lane =>
      <Lane className={`${COMP_NS}-lane`}
            key={lane.id}
            lane={lane}
            COMP_NS={COMP_NS} />
    )}</div>
  );
}
