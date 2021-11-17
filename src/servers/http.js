import Taro from "@tarojs/taro";
// import getBaseUrl from "./baseUrl";
import interceptors, { interceptorsResponse } from "./interceptors";
import cookie from "react-cookies";
import { clearDeep } from "./utils";

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem));

class httpRequest {
  baseOptions(params, method = "GET") {
    const { url, data, responseType } = params;
    // const BASE_URL = getBaseUrl(url);
    let contentType = params.contentType || "application/json";
    let apiMatch = /clever-research|clever-oauth/.test(url);
    let apiRouter = cookie.load("_sessionId")
      ? "clever-research"
      : "clever-oauth";
    clearDeep(data);
    let option = {
      url: window.serverConfig.baseurl + `/${apiMatch ? "" : apiRouter}${url}`,
      data,
      method,
      header: {
        "content-type": contentType,
        Cookie: cookie.loadAll(),
        _sessionId: cookie.load("_sessionId"),
        username: cookie.load("username")
      },
      responseType,
      fail(err) {
        err.statusCode = err.status;
        interceptorsResponse(err);
      }
    };
    return Taro.request(option);
  }

  get(url, data = "", responseType) {
    let option = { url, data, ...responseType };
    return this.baseOptions(option);
  }

  post(url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, "POST");
  }

  patch(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "PATCH");
  }

  put(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "PUT");
  }

  delete(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "DELETE");
  }
}

export default new httpRequest();
