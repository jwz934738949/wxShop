import {
  request
} from '../../request/index'

Page({
  data: {
    // 保存商品详情数据
    goodsObj: {},
    // 判断商品是否被收藏
    isCollect: false
  },

  goodsInfo: {},

  onShow: function () {
    // 获取当前页面栈
    const pages = getCurrentPages()
    const currentPages = pages[pages.length - 1]
    const {options} = currentPages
    const {
      goods_id
    } = options
    this.getGoodsDetail(goods_id)
  },


  // 获取对应的商品详情数据
  async getGoodsDetail(goods_id) {
    const {
      data: res
    } = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    this.goodsInfo = res.message
    // 获取商品收藏的数组
    let collect = wx.getStorageSync("collect") || []
    // 判断商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.goodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: res.message.goods_name,
        goods_price: res.message.goods_price,
        /* 
          在iphone中无法识别.webp格式的图片
          在获取图片时将.webp格式换位一半格式的图片
        */
        goods_introduce: res.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.message.pics
      },
      isCollect
    })
  },

  // 点击轮播图，放大预览图片
  previewImgClick(e) {
    const urls = this.goodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    })
  },

  // 加入购物车事件
  cartAdd() {
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || []
    // 判断商品对象是否存在缓存中
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      // 不存在
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      cart.push(this.goodsInfo)
    } else {
      // 存在
      cart[index].num++
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart)
    // 添加对话框
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true
    })
  },

  // 收藏按钮被点击
  collectClick() {
    let isCollect = false
    // 获取缓存中的收藏数组
    let collect = wx.getStorageSync("collect") || []
    // 判断要收藏的商品是否在缓存中
    let index = collect.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index !== -1) {
      // 商品已收藏，点击取消收藏
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1500,
        mask: true
      })
    } else {
      collect.push(this.goodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1500,
        mask: true
      })
    }
    // 更新商品缓存
    wx.setStorageSync("collect", collect)
    this.setData({
      isCollect
    })
  }
})