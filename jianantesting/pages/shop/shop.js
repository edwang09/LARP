Page({
  data: {
    background: ['green', 'red', 'yellow'],
    
  },
  navigate: function (e) {
    wx.navigateTo({
      url: '../shop/category/' + e.target.id,
    })
  },

})