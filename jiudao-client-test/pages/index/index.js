const app = getApp();

import { Base64 } from 'js-base64';

const _encode = () => {
  // base_auth基本形式:
  const token = wx.getStorageSync('token'); // 我们只有token,所以吧token当做account,密码不用写
  const base64 = Base64.encode(token + ':'); // base64对token加密
  return 'Basic ' + base64;
};

Page({
  data: {},
  onGetToken() {
    wx.login({
      success: res => {
        if(res.code) {
          wx.request({
            url: 'http://localhost:3000/v1/token',
            method: 'POST',
            data: {
              account: res.code,
              type: 100
            },
            success: res => {
              console.log(res)
              const code = res.statusCode.toString();
              console.log(code)
              // 字符串以2开头的
              if (code.startsWith('2')) {
                wx.setStorageSync('token', res.data.token);
                console.log(wx.getStorageSync('token'));
              }
            }
          });
        }
      }
    });
  },
  onVerifyToken() {
    wx.request({
      url: 'http://localhost:3000/v1/token/verify',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        const code = res.statusCode.toString();
        // 字符串以2开头的
        if (code.startsWith('2')) {
          console.log(res.data)
        }
      }
    });
  },
  onGetLatest() {
    wx.request({
      url: 'http://localhost:3000/v1/classic/latest',
      method: 'GET',
      header: {
        Authorization: _encode()
      },
      success: res => {
        const code = res.statusCode.toString();
        // 字符串以2开头的
        if (code.startsWith('2')) {
          console.log(res.data)
        }
      }
    });
  }
})
