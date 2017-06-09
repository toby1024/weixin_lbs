// store_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baidu_map_url: 'https://api.map.baidu.com/routematrix/v2/driving',
    baidu_map_ak: 'veaxjgP10QaIwPkU5MV3ZCc0eMNM44W5',
    latitude: '0',
    longitude: '0',
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
    wx.getLocation({
      success: function (res) {
        that.setData({ latitude: res.latitude, longitude: res.longitude })
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
            origins: that.data.latitude + ',' + that.data.longitude,
            ak: that.data.baidu_map_ak,
            destinations: target
          },
          header: { 'content-type': 'application/json'},
          method: 'get',
          success: function (res) {
            console.log(res.data)
            that.setData({ distance_datas: res.data })
          },
        })

        var distance_datas = that.data.distance_datas
        var datas = []
        for (var i = 0; i < stores.length; i++) {
          var tmp = stores[i]
          // tmp.distance = distance_datas[i].text
          datas.push(tmp)
        }
        that.setData({ storeList: datas })
      },
      fail: function (res) { that.setData({ message: '获取换电站信息失败' }) },
    })
  },



})