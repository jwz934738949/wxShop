import {
  request
} from '../../request/index'
import {
  login
} from '../../utils/asyncWx'


Page({
  // 获取用户信息
  async getUserInfo(e) {
    try {
      const {
        rawData,
        signature,
        encryptedData,
        iv
      } = e.detail
      const {
        code
      } = await login()
      const loginParams = {
        rawData,
        signature,
        encryptedData,
        iv,
        code
      }
      // const {token} = await request({
      //   url: '/users/wxlogin',
      //   data: loginParams,
      //   method: 'post'
      // })
      // 由于token值具有特殊性，无法通过接口获取到
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      wx.setStorageSync("token", token)
      // 调回上一层
      wx.navigateBack({
        delta: 1
      })
    } catch (err) {
      console.log(err)
    }
  }

})