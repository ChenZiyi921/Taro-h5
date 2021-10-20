import Taro from "@tarojs/taro";
import { Component } from "react";
import { connect } from "react-redux";
import { saveLibrary } from "@/actions/library";
import { View, Text } from "@tarojs/components";
import { AtGrid, AtButton } from "taro-ui";
import { imageHost, getProject } from "@/servers/servers";

import "./index.styl";

const requireContext = require.context(
  "../../assets/images/index",
  true,
  /^\.\/.*\.png$/
);
const images = requireContext.keys().map(requireContext);

@connect(
  ({ library }) => ({
    library
  }),
  dispatch => ({
    saveLibrary(item) {
      dispatch(saveLibrary(item));
    }
  })
)
export default class Index extends Component {
  componentDidMount() {
    const { library } = this.props;
    const { projectId } = library;
    getProject({ projectId })
      .then(res => {
        this.props.saveLibrary(res.data.data);
      })
      .catch(err => {});
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  atGridJump = (item, index) => {
    const paths = [
      "/pages/statistics/index",
      "/pages/patientCase/index",
      "/pages/password/index"
    ];
    Taro.navigateTo({
      url: paths[index]
    });
  };

  render() {
    const { library } = this.props;
    return (
      <View className="index">
        <img
          className="library-logo"
          src={imageHost + library?.logoUrl}
          alt=""
        />
        <AtGrid
          className="grid"
          columnNum={3}
          onClick={this.atGridJump}
          data={[
            {
              image: images[0],
              value: "病例统计"
            },
            {
              image: images[1],
              value: "病例录入"
            },
            {
              image: images[2],
              value: "修改密码"
            }
          ]}
        />
      </View>
    );
  }
}
