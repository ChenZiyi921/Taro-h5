import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "../iconfont";
import { AtInput } from "taro-ui";

import "./index.styl";

export default class Accordion extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const {
      title,
      value,
      disabled,
      required,
      onChange,
      type,
      privateAttr
    } = this.props;
    return (
      <View
        style={{ display: "flex", justifyContent: "space-between" }}
        className={`proportion at-input ${
          required ? "at-input__title--required" : ""
        } ${disabled ? "at-input--disabled" : ""}`}
      >
        <Text className="at-input__title">{title}</Text>
        {type === "input-proportion" ? (
          <View style={{ display: "flex", flex: 1 }}>
            <AtInput
              className="input"
              type="number"
              value={value?.numerator || ""}
              disabled={disabled}
              onChange={onChange.bind(this, "numerator")}
            />
            <Text style={{ padding: "0 10px" }}>/</Text>
            <AtInput
              className="input"
              type="number"
              value={value?.denominator || ""}
              disabled={disabled}
              onChange={onChange.bind(this, "denominator")}
            />
          </View>
        ) : null}
        {type === "input-number-interval" ? (
          <View style={{ display: "flex", flex: 1 }}>
            <AtInput
              className="input"
              type="number"
              value={value?.minValue || ""}
              disabled={disabled}
              onChange={onChange.bind(this, "minValue")}
            />
            <Text style={{ padding: "0 10px" }}>-</Text>
            <AtInput
              className="input"
              type="number"
              value={value?.maxValue || ""}
              disabled={disabled}
              onChange={onChange.bind(this, "maxValue")}
            />
          </View>
        ) : null}
        {type === "input-number-unit-interval" ? (
          <View style={{ display: "flex", flex: 1 }}>
            <AtInput
              className="input"
              type="number"
              value={value?.minValue || ""}
              disabled={disabled}
              onChange={onChange.bind(this, "minValue")}
            >
              <Text>{privateAttr.checkedLowerUnit.unit}</Text>
            </AtInput>
            <Text style={{ padding: "0 10px" }}>-</Text>
            <AtInput
              className="input"
              type="number"
              value={value?.maxValue || ""}
              disabled={disabled}
              onChange={onChange.bind(this, "maxValue")}
            >
              <Text>{privateAttr.checkedUpperUnit.unit}</Text>
            </AtInput>
          </View>
        ) : null}
      </View>
    );
  }
}
