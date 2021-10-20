import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { globalData } from "../../utils/utils";

import "./index.styl";

export default class My extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  toMyCollect = () => {
    Taro.navigateTo({
      url: "/pages/collect/index"
    });
  };

  toPassword = () => {
    Taro.navigateTo({
      url: "/pages/password/index"
    });
  };

  render() {
    return (
      <View className="chen-wrap my">
        <View className="list">
          <View className="item hr" onClick={this.toMyCollect}>
            <View>我的收藏</View>
            <View className="arrow"></View>
          </View>
          <View className="item hr" onClick={this.toPassword}>
            <View>修改密码</View>
            <View className="arrow"></View>
          </View>
        </View>
        <View className="logout">
          <AtButton type="primary" formType="submit">
            退出登录
          </AtButton>
        </View>
      </View>
    );
  }
}
