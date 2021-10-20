import Taro from "@tarojs/taro";
import { pageToLogin } from "./utils";
import { HTTP_STATUS } from "./config";

const interceptorsResponse = res => {
  if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
    Taro.showToast({
      title: "请求资源不存在",
      duration: 2000,
      icon: "none"
    });
  } else if (
    res.statusCode === HTTP_STATUS.BAD_GATEWAY ||
    res.statusCode === HTTP_STATUS.GATEWAY_TIMEOUT
  ) {
    Taro.showToast({
      title: "服务端出现了问题",
      duration: 2000,
      icon: "none"
    });
  } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
    Taro.showToast({
      title: "没有权限访问",
      duration: 2000,
      icon: "none"
    });
    setTimeout(() => {
      pageToLogin();
    }, 2000);
  } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
    Taro.showToast({
      title: "需要鉴权",
      duration: 2000,
      icon: "none"
    });
    setTimeout(() => {
      pageToLogin();
    }, 2000);
  } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
    return res;
  } else {
    Taro.showToast({
      title: "服务端出现了问题",
      duration: 2000,
      icon: "none"
    });
  }
};

const customInterceptor = chain => {
  const requestParams = chain.requestParams;
  return chain.proceed(requestParams).then(res => {
    return interceptorsResponse(res);
  });
};

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
// const interceptors = [customInterceptor, Taro.interceptors.logInterceptor];
const interceptors = [customInterceptor];

export { interceptorsResponse };
export default interceptors;
