// 导入异步请求函数request，使用Promise实现
import {
  request
} from "../../request/index"

Page({
  data: {
    // 获取轮播图的返回数组
    swiperList: [],
    // 获取导航的返回数组
    cateList: [],
    // 获取楼层的返回数组
    floorList: []
  },

  // 页面开始加载就会执行
  onLoad(query) {
    this.getSwiperData();
    this.getCateData();
    this.getFloorData();
  },

  // 获取轮播图数据
  async getSwiperData() {
    // 发送异步请求获取轮播图的数据
    const {
      data: res
    } = await request({
      url: '/home/swiperdata'
    })
    res.message.forEach((v, i) => {
      v.navigator_url = v.navigator_url.replace('main', 'index')
    })
    this.setData({
      swiperList: res.message
    })
  },

  // 获取导航数据
  async getCateData() {
    const {
      data: res
    } = await request({
      url: '/home/catitems'
    })
    this.setData({
      cateList: res.message
    })
  },

  // 获取楼层数据
  async getFloorData() {
    const {data: res} = await request({
      url: '/home/floordata'
    })
    res.message.forEach((v, i) => {
      v.product_list.forEach(a => {
        a.navigator_url = a.navigator_url.replace('?', '/index?')
      })
    })
    this.setData({
      floorList: res.message
    })
  }
})