import {
  request
} from '../../request/index'

Page({
  data: {
    // 搜索的商品数据
    goods: [],
    // 控制按钮的显示与隐藏
    isFocus: false,
    // 控制input中输入的内容
    inpVal: ''
  },

  // 定义定时器
  timer: -1,

  //  Input输入框中内容的改变
  handleInput(e) {
    let {
      value
    } = e.detail
    if (!value.trim()) {
      return
    }
    // 控制按钮显示
    this.setData({
      isFocus: true
    })
    // 使用防抖方法判断输入是否完成
    // 清空定时器
    clearTimeout(this.timer)
    // 定义定时器，当输入完毕后1s执行其中的内容
    this.timer = setTimeout(() => {
      this.searchGoods(value)
    }, 1000)
  },

  // 查询商品
  async searchGoods(query) {
    const {
      data: res
    } = await request({
      url: '/goods/qsearch',
      data: {
        query
      }
    })
    this.setData({
      goods: res.message
    })
  },

  // 取消按钮的点击
  cancelClick() {
    this.setData({
      isFocus: false,
      inpVal: '',
      goods: []
    })
  }
})