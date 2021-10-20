import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "../iconfont";

import "./index.styl";

export default class Accordion extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { title, value, disabled, required, onInput } = this.props;
    return (
      <View
        style={{ display: "flex", justifyContent: "space-between" }}
        className={`proportion at-input ${
          required ? "at-input__title--required" : ""
        } ${disabled ? "at-input--disabled" : ""}`}
      >
        <Text className="at-input__title">{title}</Text>
        <View style={{ display: "flex" }}>
          <input
            className="input"
            type="number"
            value={value?.numerator || ""}
            disabled={disabled}
            onInput={onInput.bind(this, "numerator")}
          />
          <Text style={{ padding: "0 10px" }}>/</Text>
          <input
            className="input"
            type="number"
            value={value?.denominator || ""}
            disabled={disabled}
            onInput={onInput.bind(this, "denominator")}
          />
        </View>
      </View>
    );
  }
}
