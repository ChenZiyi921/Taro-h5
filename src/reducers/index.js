import { combineReducers } from "redux";

const modulesFiles = require.context("./", true, /\.js$/);
let fileNames = {};
modulesFiles.keys().forEach(name => {
  if (name !== "./index.js") {
    let key = modulesFiles(name)?.default?.name;
    fileNames[key] = modulesFiles(name).default || modulesFiles(name);
  }
});

const appReducer = combineReducers(fileNames);

const rootReducer = (state, action) => {
  if (action.type === "RESET_DATA") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
