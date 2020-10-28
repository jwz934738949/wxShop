import {
  request
} from '../../request/index'

Page({
  data: {
    tabs: [{
        id: 0,
        title: '全部',
        isActive: true
      },
      {
        id: 1,
        title: '待付款',
        isActive: false
      },
      {
        id: 2,
        title: '待发货',
        isActive: false
      }, {
        id: 3,
        title: '退款/退货',
        isActive: false
      }
    ],
    // 保存订单数据
    orders: []
  },

  onShow() {
    // 获取app中的页面栈
    let pages = getCurrentPages()
    let currentPages = pages[pages.length - 1]
    let {
      type
    } = currentPages.options
    // 切换标题的选中状态
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },

  // 获取订单列表的方法
  async getOrders(type) {
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
    const {
      data: res
    } = await request({
      url: '/my/orders/all',
      data: type,
      header
    })
    this.setData({
      orders: res.message.orders.map(v => ({
        ...v,
        create_time_cn: (new Date(v.create_time * 1000).toLocaleString())
      }))
    })
  },

  tabsItemClick(e) {
    // 获取点击索引值
    const {
      index
    } = e.detail
    this.changeTitleByIndex(index)
    // 重新渲染页面，加载相应的页面
    this.getOrders(index + 1)
  },

  // 点击标题切换选中状态
  changeTitleByIndex(index) {
    // 获取data中相应数据，对数据进行修改
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  }

})