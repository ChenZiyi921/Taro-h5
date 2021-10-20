import { combineReducers } from "redux";

const modulesFiles = require.context("./", true, /\.js$/);
let fileNames = {};
modulesFiles.keys().forEach(name => {
  if (name !== "./index.js") {
    let key = modulesFiles(name)?.default?.name;
    fileNames[key] = modulesFiles(name).default || modulesFiles(name);
  }
});

export default combineReducers(fileNames);
