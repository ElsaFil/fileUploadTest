import React, { Component } from "react";

export default class Dropzone extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.openFileDialog = this.openFileDialog.bind(this);
    this.onFilesAdded = this.onFilesAdded.bind(this);
  }

  onFilesAdded = (event) => {
    if (this.props.disabled) {
      return;
    }
    const files = event.target.files;
    if (!files) {
      return;
    }
    if (!this.props.onFilesAdded) {
      return;
    }

    const array = this.fileListToArray(files);
    this.props.onFilesAdded(array);
  };

  // converts the files from a FileList to a plain JavaScript array
  fileListToArray(list) {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  }

  openFileDialog() {
    if (this.props.disabled) {
      return;
    }
    this.fileInputRef.current.click();
  }

  render() {
    return (
      <div
        className="dropzone"
        onClick={this.openFileDialog}
        style={{ cursor: this.props.disabled ? "default" : "pointer" }}
      >
        <img alt="upload-icon" className="Icon" src="cloud_upload-24px.svg" />
        <input
          ref={this.fileInputRef}
          className="FileInput"
          type="file"
          multiple
          onChange={this.onFilesAdded}
        />
      </div>
    );
  }
}
