import React, { Component } from "react";
import Dropzone from "./Dropzone";
import Progress from "./Progress";

export default class UploadForm extends Component {
  state = {
    uploading: false,
    uploadProgress: {},
    successfullyUploaded: false,
    files: [],
  };

  onFilesAdded = (files) => {
    this.setState((prevState) => ({
      files: prevState.files.concat(files),
    }));
  };

  clearList = () => {
    this.setState({
      files: [],
      successfullyUploaded: false,
      uploading: false,
      uploadProgress: {},
    });
  };

  uploadAllFilesAsync = async () => {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = this.state.files.map((file) => {
      return this.sendRequest(file);
    });
    try {
      await Promise.all(promises);
      this.setState({ successfullyUploaded: true, uploading: false });
    } catch (e) {
      // todo: error handling
      console.log(e);
      this.setState({ successfullyUploaded: false, uploading: false });
    }
  };

  sendRequest = (file) => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      // add event listeners for "progress", "load" and "error"
      // to get status of the request and update the state
      req.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = { ...this.state.uploadProgress };
          progress[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100,
          };
          console.log(progress[file.name]);
          this.setState({ uploadProgress: progress });
        }
      });

      req.upload.addEventListener("load", (event) => {
        const progress = { ...this.state.uploadProgress };
        progress[file.name] = { state: "done", percentage: 100 };
        console.log(progress[file.name]);
        this.setState({ uploadProgress: progress });
        resolve(req.response);
      });

      req.upload.addEventListener("error", (event) => {
        const progress = { ...this.state.uploadProgress };
        progress[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: progress });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("file", file, file.name);

      req.open("POST", "/api/upload");
      req.send(formData);

      // note: XMLHttpRequest can be replaced with axios, e.g.:
      // axios.post("/api/upload", formData);
    });
  };

  renderProgress = (file) => {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullyUploaded) {
      return (
        <div className="progress-wrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="check-icon"
            alt="done"
            src="done-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 1 : 0.5,
            }}
          />
        </div>
      );
    }
  };

  validFileSize = (file) => {
    let maSize = 200000;
    if (file.size > maSize) {
      console.log("file is too large");
      return false;
    }
    return true;
  };

  render() {
    return (
      <div className="upload-container">
        <span className="title">Upload Files</span>
        <div className="content">
          <Dropzone
            onFilesAdded={this.onFilesAdded}
            disabled={this.state.uploading || this.state.successfullyUploaded}
          />
          <div className="files">
            <ul>
              {this.state.files.map((file) => {
                return (
                  <li key={file.name}>
                    <div className="file-row">
                      <span className="filename">{file.name}</span>
                      {this.renderProgress(file)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="actions">
          <button
            disabled={this.state.files.length < 1 || this.state.uploading}
            onClick={this.clearList}
          >
            Clear List
          </button>
          <button
            disabled={this.state.files.length < 1 || this.state.uploading}
            onClick={this.uploadAllFilesAsync}
          >
            Upload Files
          </button>
        </div>
      </div>
    );
  }
}
