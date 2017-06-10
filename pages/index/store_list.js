// store_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baidu_map_url: 'https://api.map.baidu.com/routematrix/v2/driving',
    baidu_map_ak: '百度ak',
    message: '',
    storeList: [],
    distance_datas: []
  },
  store_map: function (e) {
    wx.navigateBack({
      delta: 1,
    })
  },

  navigate_to: function(e){
    var lat = e.target.dataset.lat
    var lng = e.target.dataset.lng
    var address = e.target.dataset.address
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      address: address,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var location = '';

    wx.getStorage({
      key: 'location',
      success: function (res) {
        location = res.data
      }
    })

    wx.getStorage({
      key: 'power_stores',
      success: function (res) {
        var stores = res.data
        var target = ''
        for (var i = 0; i < stores.length; i++) {
          var tmp = stores[i]
          target += tmp.latitude + ',' + tmp.longitude + '|'
        }
        target = target.substr(0,target.length - 1)
        console.log(target)
        wx.request({
          url: that.data.baidu_map_url,
          data: {
            output: 'json',
            origins: location ,
            ak: that.data.baidu_map_ak,
            destinations: target
          },
          header: { 'content-type': 'application/json'},
          method: 'get',
          success: function (res) {
            console.log(res.data.result)
            var baidu_distance = res.data.result
            var datas = []
            for (var i = 0; i < stores.length; i++) {
              var tmp = stores[i]
              tmp.distance = baidu_distance[i].distance.text
              datas.push(tmp)
            }
            that.setData({ distance_datas: res.data, storeList: datas  })
          },
        })

      },
      fail: function (res) { that.setData({ message: '获取换电站信息失败' }) },
    })
  },



})