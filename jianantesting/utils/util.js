const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var backendurl ='https://USBACKENDWJN704.larpxiaozhushou.tk/api/app'
var socketsend=function(that,message){
  wx.sendSocketMessage({
    data: JSON.stringify({
      table_id: that.data.table_id, message: message
    }),
  })
}
var databackup = function (that) {
  wx.request({
    url: backendurl + '/' + that.data.user_id,
    data: {
      acquiredclue: that.data.acquiredclue,
      broadcast: that.data.broadcast,
      vote: that.data.vote,
      actionpoint: that.data.actionpoint
    },
    method: "PUT",
    success: function (res) {
      console.log("data backup succeeded")
    },
  });
}
var cleardata = function () {
  console.log("clear data and back to home.")
  wx.removeStorage({
    key: 'tableid'
  })
  wx.removeStorage({
    key: 'gameid'
  })
  wx.removeStorage({
    key: 'characterid'
  })
  wx.removeStorage({
    key: 'user_id'
  })
  wx.removeStorage({
    key: 'table_id'
  })
  wx.reLaunch({
    url: '../index/index'
  })
}
module.exports = {
  formatTime: formatTime,
  socketsend: socketsend,
  databackup: databackup,
  backendurl: backendurl,
  cleardata: cleardata
}
