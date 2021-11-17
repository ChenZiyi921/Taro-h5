import Taro from "@tarojs/taro";
import { Component } from "react";
import { connect } from "react-redux";
import { saveUserInfo } from "@/actions/userInfo";
import { reset } from "@/actions/reset";
import { View, Text, Image } from "@tarojs/components";
import { AtForm, AtInput, AtButton, AtToast, AtMessage } from "taro-ui";
import {
  getCaptcha,
  getPublicKey,
  login,
  queryUserByUserId
} from "@/servers/servers";
import cookie from "react-cookies";
import "@/utils/security";

import "./index.styl";

cookie.remove("_sessionId");
cookie.remove("username");
@connect(
  ({ userInfo, reset }) => ({
    userInfo,
    reset
  }),
  dispatch => ({
    saveUserInfo(data) {
      dispatch(saveUserInfo(data));
    },
    reset() {
      dispatch(reset());
    }
  })
)
export default class Login extends Component {
  state = {
    captcha: "",
    captchaKey: "",
    password: "",
    username: "",
    disabled: true,
    captchaImage: null
  };

  componentDidMount() {
    this.getCaptchaImage();
    this.props.reset();
  }

  componentDidShow() {}

  componentDidHide() {}

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = e => {
        resolve(e.target.result);
      };
      // readAsDataURL
      fileReader.readAsDataURL(blob);
      fileReader.onerror = () => {
        reject(new Error("blobToBase64 error"));
      };
    });
  }

  getCaptchaImage = () => {
    getCaptcha({
      lastCaptchaKey: ""
    }).then(({ header, data }) => {
      this.blobToBase64(
        new Blob([new Uint8Array(data), { type: "image/jpeg" }])
      ).then(url => {
        this.setState({ captchaImage: url, captchaKey: header.captcha_key });
      });
    });
  };

  handleChange = (input, value) => {
    this.setState(
      {
        [input]: value
      },
      () => {
        const { username, password, captcha } = this.state;
        if (username && password && captcha) {
          this.setState({ disabled: false });
        } else {
          this.setState({ disabled: true });
        }
      }
    );
  };
  onSubmit = () => {
    const { captcha, captchaKey, password, username } = this.state;
    getPublicKey()
      .then(({ data: { data } }) => {
        const { exponent, modulus } = data;
        let publicKey = RSAUtils.getKeyPair(exponent, "", modulus);
        let RSAPassword = RSAUtils.encryptedString(publicKey, password);
        Taro.setStorageSync("exponent", exponent);
        Taro.setStorageSync("modulus", modulus);
        return RSAPassword;
      })
      .then(RSAPassword => {
        login({
          captcha,
          captchaKey,
          password: RSAPassword,
          username
        }).then(({ data: { code, message, data } }) => {
          if (code === "ERROR") {
            const messages = {
              username: "请输入正确账号",
              password: "请输入正确的密码",
              captcha: "请输入正确的验证码"
            };
            Taro.atMessage({
              message: messages[message.split(" ")[1]],
              type: "error"
            });
            this.getCaptchaImage();
          } else {
            const { sessionId, userId, username } = data;
            cookie.save("_sessionId", sessionId);
            cookie.save("username", username);
            queryUserByUserId({ userId })
              .then(({ data: { data } }) => {
                this.props.saveUserInfo(data);
                Taro.navigateTo({
                  url: "/pages/library/index"
                });
              })
              .catch(err => {});
          }
        });
      })
      .catch(err => {});
  };
  render() {
    const { username, password, captcha, disabled, captchaImage } = this.state;
    return (
      <View className="chen-wrap login">
        <AtMessage />
        <AtForm onSubmit={this.onSubmit}>
          <AtInput
            required
            name="username"
            title="用户名"
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={this.handleChange.bind(this, "username")}
          />
          <AtInput
            required
            name="password"
            title="密码"
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={this.handleChange.bind(this, "password")}
          />
          <AtInput
            required
            name="captcha"
            title="验证码"
            type="text"
            placeholder="请输入验证码"
            value={captcha}
            onChange={this.handleChange.bind(this, "captcha")}
          >
            <img src={captchaImage} onClick={this.getCaptchaImage} />
          </AtInput>
          <AtButton
            type="primary"
            formType="submit"
            disabled={disabled}
            className="button"
          >
            登录
          </AtButton>
        </AtForm>
      </View>
    );
  }
}
