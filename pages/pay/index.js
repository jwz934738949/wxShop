import {
  request
} from '../../request/index'

import {
  requestPayment
} from '../../utils/asyncWx'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 保存获取到的地址信息
    address: {},
    // 保存添加到购物车的商品信息
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  // 获取收货地址
  onShowAddress() {
    let address = wx.getStorageSync("address")
    let cart = wx.getStorageSync("cart") || []
    cart = cart.filter(v => v.checked === true)
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    // 把数据重新放回数组与缓存中
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShowAddress()
  },

  async orderPay() {
    let token = wx.getStorageSync("token")
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    const header = {
      Authorization: token
    }
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    let goods = []
    const {
      cart
    } = this.data
    cart.forEach(v => {
      goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      })
    })
    const orderParams = {
      order_price,
      consignee_addr,
      goods
    }
    // 获取订单数据
    const {
      data: res
    } = await request({
      url: '/my/orders/create',
      method: 'post',
      data: orderParams,
      header
    })
    const {
      order_number
    } = res.message
    // 获取支付请求
    const {
      data: res2
    } = await request({
      url: '/my/orders/req_unifiedorder',
      method: 'post',
      data: {
        order_number
      },
      header
    })
    const {
      pay
    } = res2.message
    console.log(pay)
    const res3 = await requestPayment(pay)
    console.log(res3)
  }
})