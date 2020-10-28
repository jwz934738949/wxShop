import {
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx'

// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示按钮
    isShow: true,
    // 保存获取到的地址信息
    address: {},
    // 保存添加到购物车的商品信息
    cart: [],
    // 控制全选多选框是否选中
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  // 获取收货地址
  onShowAddress() {
    let address = wx.getStorageSync("address")
    let cart = wx.getStorageSync("cart") || []
    this.setData({
      address
    })
    this.setCart(cart)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShowAddress()
  },

  //  获取收货地址按钮点击
  async addressBtnClick() {
    try {
      const res = await chooseAddress()
      this.setData({
        isShow: true
      })
      res.all = res.provinceName + res.cityName + res.countyName + res.detailInfo
      wx.setStorageSync("address", res)
    } catch (err) {
      this.setData({
        isShow: false
      })
    }
  },

  // 获取手机权限设置
  async openSettingClick() {
    const res = await openSetting()
    if (res.authSetting['scope.address'] === true) {
      this.setData({
        isShow: true
      })
    }
  },

  // 复选框状态切换事件
  cartItemChange(e) {
    // 获取点击的商品ID
    const {
      id
    } = e.currentTarget.dataset
    // 获取购物车数组
    let {
      cart
    } = this.data
    // 获取购物车缓存中对应的项
    const index = cart.findIndex(v => v.goods_id === id)
    // 选中状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },

  // 修改cart数组同时计算其他状态属性
  setCart(cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length ? allChecked : false
    // 把数据重新放回数组与缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync("cart", cart)
  },

  // 修改全选复选框状态切换事件
  allCheckedChange() {
    // 获取cart数组与allChecked属性
    let {
      cart,
      allChecked
    } = this.data
    // 取反
    allChecked = !allChecked
    // 遍历数组
    cart.forEach(v => v.checked = allChecked)
    // 修改cart数组与缓存
    this.setCart(cart)
  },

  // 修改商品数量
  async itemNumEdit(e) {
    const {
      id,
      operation
    } = e.currentTarget.dataset
    let {
      cart
    } = this.data
    // 获取要修改的商品
    const index = cart.findIndex(v => v.goods_id === id)
    if (cart[index].num === 1 && operation === '-1') {
      const res = await showModal({
        content: '您确认删除该商品吗？'
      })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].num += Number(operation)
      this.setCart(cart)
    }
  },

  // 点击结算按钮
  async payClick() {
    const {
      address,
      totalNum
    } = this.data
    if (!address.userName) {
      await showToast({
        title: '您还没有选择收货地址！'
      })
      return
    }
    if (totalNum === 0) {
      await showToast({
        title: '您还没有选择要购买的商品！'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})