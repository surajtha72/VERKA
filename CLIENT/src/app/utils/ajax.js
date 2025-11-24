/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { getRefreshToken } from "./apiCalls";

export function fetchCall(callback, url, method, payload) {
  return new Promise(function (resolve, reject) {
    const options = {
      method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error?.statusCode === 401 || res.error?.status === 401) {
          console.log(res.error);
        } else {
          callback(res);
          resolve(res);
        }
      })
      .catch((err) => {
        callback(err);
        return err;
      });
  });
}

export function fetchNoCall(callback, url, method, payload) {
  return new Promise(function (resolve, reject) {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error?.statusCode === 401 || res.error?.status === 401) {
          console.log(res.error);
        } else {
          callback(res);
          resolve(res);
        }
      })
      .catch((err) => {
        callback(err);
        return err;
      });
  });
}

export function fetchLoginCall(callback, url, method, payload) {
  const token = localStorage.getItem("token");
  return new Promise(function (resolve, reject) {
    const options = {
      method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        accept: "text/plain",
        authorization: "Bearer " + [token],
      },
    };
    fetch(url, options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error?.statusCode === 401 || res.error?.status === 401) {
          if (res.error) {
            localStorage.setItem("url", url);
            localStorage.setItem("method", method);
            localStorage.setItem("payload", JSON.stringify(payload));
          }
          const tokenPayload = {
            refreshToken: localStorage.getItem("refreshToken"),
          };
          getRefreshToken((response) => {
            const { data } = response;
            localStorage.setItem("token", data?.userDetails?.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            const url = localStorage.getItem("url");
            const method = localStorage.getItem("method");
            let payload = localStorage.getItem("payload");
            if (payload !== "undefined") {
              payload = JSON.parse(payload);
              fetchCall(callback, url, method, payload);
            } else {
              fetchCall(callback, url, method);
            }
          }, tokenPayload.refreshToken);
        } else {
          callback(res);
          resolve(res);
        }
      })
      .catch((err) => {
        // // callback(err);
        // // return err;
        // if (err?.statusCode === 403 || err?.status === 403) {
        callback("Access denied", err);
        return err;
        // console.log("Request failed with 403 Forbidden status");
        // }
      });
  });
}
