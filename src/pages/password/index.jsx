import Taro from "@tarojs/taro";
import { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "@tarojs/components";
import { AtForm, AtInput, AtButton, AtToast, AtMessage } from "taro-ui";
import { checkOldPassword, resetPassword } from "@/servers/servers";
import "@/utils/security";

import "./index.styl";

@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({})
)
export default class Password extends Component {
  state = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
    disabled: true
  };

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleChange = (input, value) => {
    this.setState(
      {
        [input]: value
      },
      () => {
        const { oldPassword, password, confirmPassword } = this.state;
        if (oldPassword && password && confirmPassword) {
          this.setState({ disabled: false });
        } else {
          this.setState({ disabled: true });
        }
      }
    );
  };

  checkOldPassword = RSAPassword => {
    return new Promise((resolve, reject) => {
      const { userInfo } = this.props;
      const { userName } = userInfo;
      checkOldPassword({
        oldPassword: RSAPassword,
        username: userName
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch(err => {});
    });
  };

  resetPassword = RSAPassword => {
    const { userInfo } = this.props;
    const { userName } = userInfo;
    resetPassword({
      password: RSAPassword,
      username: userName
    }).then(res => {
      if (res) {
        Taro.atMessage({
          message: "修改成功",
          type: "success"
        });
      } else {
        Taro.atMessage({
          message: "修改失败",
          type: "error"
        });
      }
    });
  };

  onSubmit = () => {
    const { password } = this.state;
    let exponent = Taro.getStorageSync("exponent");
    let modulus = Taro.getStorageSync("modulus");
    let publicKey = RSAUtils.getKeyPair(exponent, "", modulus);
    let RSAPassword = RSAUtils.encryptedString(publicKey, password);
    this.checkOldPassword(RSAPassword).then(res => {
      if (res) {
        const { password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
          Taro.atMessage({
            message: "两次密码输入不一致",
            type: "error"
          });
          return;
        }
      } else {
        this.resetPassword(RSAPassword);
      }
    });
  };

  render() {
    const { oldPassword, password, confirmPassword, disabled } = this.state;
    return (
      <View className="chen-wrap password">
        <AtMessage />
        <AtForm onSubmit={this.onSubmit}>
          <AtInput
            required
            name="oldPassword"
            title="旧密码"
            type="password"
            placeholder="请输入旧密码"
            value={oldPassword}
            onChange={this.handleChange.bind(this, "oldPassword")}
          />
          <AtInput
            required
            name="password"
            title="新密码"
            type="password"
            placeholder="请输入新密码"
            value={password}
            onChange={this.handleChange.bind(this, "password")}
          />
          <AtInput
            required
            name="confirmPassword"
            title="确认密码"
            type="password"
            placeholder="请输入新密码"
            value={confirmPassword}
            onChange={this.handleChange.bind(this, "confirmPassword")}
          />
          <AtButton
            type="primary"
            formType="submit"
            disabled={disabled}
            className="button"
          >
            确定
          </AtButton>
        </AtForm>
      </View>
    );
  }
}
