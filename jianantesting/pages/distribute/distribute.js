Page({

  /**
   * 页面的初始数据
   */
  data: {
    infomation: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(options.value){
      this.setData({
        infomation: options.value
      })
    }
    }
})