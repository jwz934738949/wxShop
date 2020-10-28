// pages/collect/index.js
Page({

  data: {
    tabs: [{
        id: 0,
        title: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        title: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        title: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        title: '浏览足迹',
        isActive: false
      }
    ],
    collect: []
  },

  onShow() {
    const collect = wx.getStorageSync("collect")
    this.setData({
      collect
    })
  },

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
  }

})