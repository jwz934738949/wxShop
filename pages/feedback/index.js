// pages/feedback/index.js
Page({
  data: {
    tabs: [{
        id: 0,
        title: '体验问题',
        isActive: true
      },
      {
        id: 1,
        title: '商品、商家投诉',
        isActive: false
      }
    ],
    // 保存上传的图片路径
    chooseImgs: [],
    // 保存文本域输入的内容
    textVal: ''
  },

  // 外网上传的图片路径
  uploadImgs: [],

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

  // 点击添加图片
  addImgClick() {
    wx.chooseImage({
      // 同时选择图片的数量
      count: 9,
      // 图片格式
      sizeType: ['original', 'compressed'],
      // 图片来源
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    })
  },

  // 点击删除图片
  removeImgClick(e) {
    let {
      index
    } = e.currentTarget.dataset
    let {
      chooseImgs
    } = this.data
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },

  // 监听文本域的输入事件
  textInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 点击提交按钮
  formSubmit() {
    // 输入域的内容
    const {
      textVal,
      chooseImgs
    } = this.data
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return
    }
    // 显示加载界面
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })

    if (chooseImgs.length !== 0) {
      chooseImgs.forEach((v, i) => {
        // 上传图片到图床网站中
        wx.uploadFile({
          // 上传图片到哪个路径下
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的路径
          filePath: v,
          // 上传文件的名称，从后台获取文件
          name: 'image',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let {
              url
            } = JSON.parse(result.data).data
            this.uploadImgs.push(url)
            console.log(this.uploadImgs)

            // 所有图片都上传完毕后
            if (i === chooseImgs.length - 1) {
              wx.hideLoading()
              console.log("上传完毕")
              this.setData({
                textVal: '',
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    } else {
      wx.hideLoading()
      console.log("上传了文本内容")
      wx.navigateBack({
        delta: 1
      })
    }
  }


})