import React, { Component } from "react";

export default class Progress extends Component {
  render() {
    return (
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: this.props.progress + "%" }}
        />
      </div>
    );
  }
}
