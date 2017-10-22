Page({
  data: {
    background: ['green', 'red', 'yellow'],
    gamelist:[],
    currentgame:{}
  },
  navigate: function (e) {
    wx.showToast({ title: '敬请期待', icon: 'loading', duration: 1000 });
    
    //wx.navigateTo({
      //url: '../shop/category/' + e.target.id,
    //})
  },
  introduction: function (e) {
    let that = this
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/game?id=' + e.target.id,
      success: function (res) {
        that.setData({
          currentgame: res.data[0]
        })

      },
      complete: function (){
        var content = '游戏名称：' + that.data.currentgame.name + '； 游戏人数：' + that.data.currentgame.playernumber + '； 最少男性人数：' + that.data.currentgame.malenumber + '； 最少女性人数：' + that.data.currentgame.femalenumber + '； 游戏简介：' + that.data.currentgame.descripion
        wx.showModal({
          title: '详细介绍',
          content: content,
          confirmText:'创建',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../create/create?gameid=' + that.data.currentgame.id
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    });
    
  },
  onShow: function (e) {
    let that = this
    wx.request({
      url: 'https://larpxiaozhushou.tk/api/game/',
      success: function (res) {
        that.setData({
          gamelist: res.data
        })
      },
    });

  }
})