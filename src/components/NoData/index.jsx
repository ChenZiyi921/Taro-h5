import { Component } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "../iconfont";

import "./index.styl";

export default class NoData extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { props } = this.props;
    const { height, iconName, text, size, textStyle, color } = props;
    return (
      <View className="no-data" style={{ height }}>
        <View className="content">
          <IconFont
            name={iconName}
            size={size || 400}
            color={color}
            style={{ margin: "auto" }}
          ></IconFont>
          <Text className="text" style={textStyle || {}}>
            {text}
          </Text>
        </View>
      </View>
    );
  }
}
