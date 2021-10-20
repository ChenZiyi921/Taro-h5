import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "../iconfont";

import "./index.styl";

export default class Accordion extends Component {
  state = {
    open: false
  };

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  changeOpen = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { open } = this.state;
    const { title, disabled, children } = this.props;
    return (
      <View>
        <View className="at-accordion__header" onClick={this.changeOpen}>
          <View className="at-accordion__info">
            <View
              className="at-accordion__info__title"
              style={disabled ? { color: "#97d5ff" } : {}}
            >
              {title}
            </View>
          </View>
          <View
            style={disabled ? { color: "#ddd" } : {}}
            className={`at-accordion__arrow at-icon at-icon-chevron-down hydrated ${
              open ? "at-accordion__arrow--folded" : ""
            }`}
          ></View>
        </View>
        <View
          className={`${
            open ? "at-accordion__content" : "at-accordion__content--inactive"
          }`}
          ref={node => (this.childElement = node)}
        >
          {this.childElement ? children : open ? children : null}
        </View>
      </View>
    );
  }
}
