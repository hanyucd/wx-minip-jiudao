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
  },
  onLike() {
    wx.request({
      url: 'http://localhost:3000/v1/like',
      method: 'POST',
      header: {
        Authorization: _encode()
      },
      data: {
        art_id: 1,
        type: 100,
      },
      success: res => {
        const code = res.statusCode.toString();
        // 字符串以2开头的
        if (code.startsWith('2')) {
          console.log(res.data)
        }
      }
    });
  },
  onGetClassicFavor() {
    wx.request({
      url: 'http://localhost:3000/v1/classic/100/1/favor',
      method: 'GET',
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
  onGetHotBookList() {
    wx.request({
      url: 'http://localhost:3000/v1/book/hot_list',
      method: 'GET',
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
  onBookSearchonGetBookDetail() {
    wx.request({
      url: 'http://localhost:3000/v1/book/1120/detail',
      method: 'GET',
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
  onBookSearch() {
    wx.request({
      url: 'http://localhost:3000/v1/book/search',
      method: 'GET',
      data: {
        q: '东野圭吾',
        count: 10,
      },
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
  onGetMyFavorsBookCount() {
    wx.request({
      url: 'http://localhost:3000/v1/book/favor/count',
      method: 'GET',
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
  onGetBookFavor() {
    wx.request({
      url: 'http://localhost:3000/v1/book/65/favor',
      method: 'GET',
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
  onAddShortComment() {
    wx.request({
      url: 'http://localhost:3000/v1/book/add/short_comment',
      method: 'POST',
      data: {
        content: '春风十里',
        book_id: 65
      },
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
  onGetComments() {
    wx.request({
      url: 'http://localhost:3000/v1/book/65/short_comment',
      method: 'GET',
      header: {
        Authorization: _encode()
      },
      success: res => {
        console.log(res.data)
      },
    })
  },
})
