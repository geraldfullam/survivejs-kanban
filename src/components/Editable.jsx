import React from 'react';

export default class Editable extends React.Component {

  render () {
    // Render the component differently based on state.
    return (
      <div className={`${this.props.COMP_NS}-editable`}>
        { this.props.editing ?
          this.renderEdit() :
          this.renderValue() }
        { this.props.onDelete ?
          this.renderDelete() :
          null }
      </div>
    );
  }

  renderEdit = () => {
    return (
      <input type="text"
             ref={
               element => element ?
                 element.select() :
                 null
             }
             autoFocus={true}
             defaultValue={this.props.value}
             onBlur={this.finishEdit}
             onKeyPress={this.checkEnter} />
    );
  };

  renderValue = () => {
    return (
      <span tabIndex="0"
            onClick={ this.props.onValueClick }
            onFocus={ this.props.onValueClick }>
        {this.props.value}
      </span>
    );
  };

  renderDelete = () => {
    return (
      <button className={`${this.props.COMP_NS}-deleteButton`}
              onClick={this.props.onDelete}
              aria-label="Delete this">
        <span aria-hidden="true">&times;</span>
      </button>
    );
  };

  checkEnter = (e) => {
    // The user hit *enter*, let's finish up.
    if (e.key === 'Enter') {
      this.finishEdit(e, true);
    }
  };

  finishEdit = (e, setOuterFocus = false) => {
    // `Note` will trigger an optional `onEdit` callback once it has a new value. We will use this to communicate the change to `App`.
    //
    // A smarter way to deal with the default value would be to set it through `defaultProps`.
    //
    // See the *Typing with React* (http://survivejs.com/webpack_react/typing_with_react).
    const value = e.target.value;

    if (this.props.onEdit) {
      this.props.onEdit(value, setOuterFocus);
    }
  };
}
