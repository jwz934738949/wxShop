import {
  request
} from '../../request/index'

Page({
  data: {
    // 保存左侧菜单数据的数组
    leftMenuList: [],
    // 保存右侧具体商品数据的数组
    rightContentList: [],
    // 保存选中的左侧菜单的索引
    currentIndex: 0,
    // 设置滚动条距离顶部的位置为0
    scrollTop: 0
  },

  // 获取分类参数的数组
  catesList: [],


  onLoad: function (options) {
    /* 
      为了提高用户的体验，可以使用缓存技术来存储从服务器获取到的数据
      首先判断本地存储中是否有旧的数据。格式为{time: 存储时间,data:[获取的数据]}
      如果没有旧的数据，则发送新的请求
      有旧的数据，判断数据是否过期，没有过期就使用该缓存数据
    */
    const cates = wx.getStorageSync("cates")
    if (!cates) {
      this.getCates()
    } else {
      if (Date.now() - cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates()
      } else {
        // 请求缓存数据
        this.catesList = cates.data
        let leftMenuList = this.catesList.map(value => value.cat_name)
        // 获取右侧商品数据
        let rightContentList = this.catesList[0].children
        this.setData({
          leftMenuList,
          rightContentList
        })
      }
    }
  },

  // 获取分类数据
  async getCates() {
    const {data: res} = await request({
      url: '/categories'
    })
    this.catesList = res.message
    // 将获取到的数据保存到本地存储中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.catesList
    })
    // 获取左侧菜单数据
    let leftMenuList = this.catesList.map(value => value.cat_name)
    // 获取右侧商品数据
    let rightContentList = this.catesList[0].children
    this.setData({
      leftMenuList,
      rightContentList
    })
  },

  // 菜单项的点击事件
  menuClick(e) {
    // 获取当前点击的index值
    const {
      index
    } = e.currentTarget.dataset
    // 根据index获取到相对应的商品数据
    let rightContentList = this.catesList[index].children
    // 将index赋给currentIndex
    this.setData({
      currentIndex: index,
      rightContentList,
      // 重新设置滚动条距离顶部的位置
      scrollTop: 0
    })
  }

})