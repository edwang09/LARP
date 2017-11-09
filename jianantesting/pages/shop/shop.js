
const app = getApp()
Page({
  data: {
    background: ['1' ,'2', '3'],
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
      url: 'https://larpxiaozhushou.tk/api/app?type=game&id=' + e.target.id,
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
              wx.request({
                url: 'https://larpxiaozhushou.tk/api/app?type=table&hostid=' + app.globalData.userInfo.nickName,
                success: function(res){
                  var table
                  for (table in res.data) {
                    wx.request({
                      url: 'https://larpxiaozhushou.tk/api/app/' + res.data[table]._id,
                      method: 'DELETE'
                    })
                    wx.request({
                      url: 'https://larpxiaozhushou.tk/api/app?type=user&tableid=' + res.data[table].tableid,
                      success: function (res) {
                        var player
                        wx.request({
                          url: 'https://larpxiaozhushou.tk/api/app/' + res.data[player]._id,
                          method: 'DELETE'
                        })
                        }
                    })
                  }
                }
              })
              wx.request({
                url: 'https://larpxiaozhushou.tk/api/app?type=user&usernickname=' + app.globalData.userInfo.nickName,
                success: function (res) {
                  var user
                  for (user in res.data) {
                    wx.request({
                      url: 'https://larpxiaozhushou.tk/api/app/' + res.data[user]._id,
                      method: 'DELETE',
                      success: function (res) {
                      }
                    })
                  }
                }
              })
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
      url: 'https://larpxiaozhushou.tk/api/app?type=game',
      success: function (res) {
        that.setData({
          gamelist: res.data
        })
      },
    });

  }
})