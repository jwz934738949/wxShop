// 保存请求的次数
let reqTimes = 0

export const request = (params) => {
  reqTimes++
  // 显示正在加载中提示框
  wx.showLoading({
    title: "加载中",
    mask: true
  })

  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      // 不论成功与失败，都会触发
      complete: () => {
        reqTimes--
        if (reqTimes === 0) {
          // 隐藏加载中提示框
          wx.hideLoading()
        }
      }
    })
  })
}