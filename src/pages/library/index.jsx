import Taro from "@tarojs/taro";
import { Component } from "react";
import { connect } from "react-redux";
import { saveLibrary } from "@/actions/library";
import { View, Text } from "@tarojs/components";
import { getProjectsList, imageHost, imageHost2 } from "@/servers/servers";
import { libraryStatusBackground } from "@/dictionary/status";

import "./index.styl";

@connect(
  ({ library, userInfo }) => ({
    library,
    userInfo
  }),
  dispatch => ({
    saveLibrary(item) {
      dispatch(saveLibrary(item));
    }
  })
)
export default class Library extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    this.getProjectsList();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getProjectsList = () => {
    const { userInfo } = this.props;
    const { userId } = userInfo;
    getProjectsList({ userId })
      .then(({ data: { data } }) => {
        this.setState({ data });
        if (data.length === 1) {
          this.jumpHomePage(data[0]);
        }
      })
      .catch(err => {});
  };

  jumpHomePage = item => {
    this.props.saveLibrary(item);
    Taro.navigateTo({
      url: "/pages/index/index"
    });
  };

  render() {
    const { data } = this.state;
    return (
      <View className="chen-wrap library">
        {data.map((item, index) => {
          return (
            <View
              className="list"
              key={index}
              onClick={this.jumpHomePage.bind(this, item)}
            >
              <img
                className="image"
                src={
                  `${
                    item.logoUrl.indexOf("project-logo") === -1
                      ? imageHost
                      : imageHost2
                  }` + item.logoUrl
                }
                alt=""
              />
              <Text className="title">{item.projectName}</Text>
              <Text
                className="state"
                style={libraryStatusBackground[item.statusCode]}
              >
                {item.statusName}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
}
