import { Component } from "react";
import { Provider } from "react-redux";
import cookie from "react-cookies";
import store, { persistor } from "./store/index";
import { PersistGate } from "redux-persist/integration/react";
import vconsole from "vconsole";

import "taro-ui/dist/style/index.scss";
import "./app.styl";

if (process.env.NODE_ENV === "development") {
  new vconsole();
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>{this.props.children}</PersistGate>
      </Provider>
    );
  }
}

export default App;
