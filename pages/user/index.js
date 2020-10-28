// pages/user/index.js
Page({
  data: {
    userInfo: {},
    // 收藏商品数目
    collectNum: 0
  },

  onShow() {
    const userInfo = wx.getStorageSync("userInfo")
    const collectNum = wx.getStorageSync("collect").length
    this.setData({
      userInfo,
      collectNum
    })
  }
})