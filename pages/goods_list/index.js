// pages/goods_list/index.js
import {
  request
} from '../../request/index'

Page({
  data: {
    // 保存导航栏内容
    tabs: [{
        id: 0,
        title: "综合",
        isActive: true
      },
      {
        id: 1,
        title: "销量",
        isActive: false
      },
      {
        id: 3,
        title: "价格",
        isActive: false
      }
    ],
    // 保存商品信息
    goodsList: []
  },

  // 要查询的参数
  queryParams: {
    query: '',
    cid: 0,
    pagenum: 1,
    pagesize: 10
  },

  // 保存返回的数据总页数
  totalPage: 0,

  onLoad: function (options) {
    this.queryParams.cid = options.cid || ""
    this.queryParams.query = options.query || ""
    this.getGoodsList()
  },

  // 获取商品数据
  async getGoodsList() {
    const {
      data: res
    } = await request({
      url: '/goods/search',
      data: this.queryParams
    })
    // 获取返回的数据条数
    const total = res.message.total
    this.totalPage = Math.ceil(total / this.queryParams.pagesize)
    this.setData({
      // 拼接数据，将之前的数据与新获取的数据一并保存
      goodsList: [...this.data.goodsList, ...res.message.goods]
    })
    // 关闭下拉刷新动画
    wx.stopPullDownRefresh()
  },

  // 点击导航事件
  tabsItemClick(e) {
    // 获取点击索引值
    const {
      index
    } = e.detail
    // 获取data中相应数据，对数据进行修改
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },

  // 页面触底函数
  onReachBottom: function () {
    // 判断是否有下一页数据
    if (this.queryParams.pagenum >= this.totalPage) {
      // 没有下一页数据
      // 使用提示框显示提示信息
      wx.showToast({
        title: '没有下一页数据！'
      })
    } else {
      // 还有下一页数据
      // 页码加1，重新获取商品列表
      this.queryParams.pagenum++
      this.getGoodsList()
    }
  },

  // 下拉刷新事件
  onPullDownRefresh() {
    // 重置商品列表
    this.setData({
      goodsList: []
    })
    // 重置页码数
    this.queryParams.pagenum = 1
    // 重新获取商品列表
    this.getGoodsList()
  }
})