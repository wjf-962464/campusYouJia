// pages/login/login.js
const httpUtil = require("../../http/httpUtil.js")
const url = require("../../constants/interfaceUrl.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  userLogin() {
    wx.login({
      success(res) {
        // console.log(res.code)
        if (res.code) {
          httpUtil.httpPost(url.user.login, {js_code:res.code}, (res) => {
            wx.setStorageSync("login_flag", res.data.login_flag)
            wx.redirectTo({
              url: "../activity/dayCouples/main",
              success: function() {
                wx.showToast({
                  title: '登录成功',
                  icon: 'success'
                })
              },
              fail: function() {
                console.log("页面跳转失败")
              }
            })
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '登录失败!',
          })
        }
      }
    })
  },
})