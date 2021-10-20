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
    const { height, iconName, text } = props;
    return (
      <View className="no-data" style={{ height }}>
        <View className="content">
          <IconFont name={iconName} size={400}></IconFont>
          <Text className="text">{text}</Text>
        </View>
      </View>
    );
  }
}
