//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    storeList: [],
    markers: [],
    points: [],
    query_store_url: '获取数据url'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  store_list: function (e) {
    wx.navigateTo({
      url: '/pages/index/store_list',
    })
  },

  onLoad: function () {
    this.mapCtx = wx.createMapContext('myMap')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据 
      that.setData({ userInfo: userInfo })
    })
    wx.getLocation({
      success: function (res) {
        wx.setStorage({
          key: "location",
          data: res.latitude + ',' + res.longitude
        })
      }
    })

    wx.request({
      url: that.data.query_store_url,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({ storeList: res.data })
        var stores = res.data
        console.log(stores)
        var store_list = []
        var points = []

        for (var i = 0; i < stores.length; i++) {
          var tmp = stores[i]
          store_list.push({ name: tmp.name, address: tmp.address, distance: i, latitude: tmp.latitude, longitude: tmp.longitude })
          points.push({ latitude: tmp.latitude, longitude: tmp.longitude })
        }
        that.setData({ markers: points, points: points })
        wx.setStorage({
          key: 'power_stores',
          data: store_list,
        })
      },
    })

  }
})
