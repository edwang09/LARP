// pages/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options.gameid)
    this.setData({
      gameid: options.gameid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'info') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '游戏及人介绍',
      imageUrl: '/icon/侦探剪影.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

    if (res.from === 'forward') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '“望江南”人物码',
      path: 'pages/intro/intro',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})