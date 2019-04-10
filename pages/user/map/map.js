Page({
  data: {
    latitude: 28.11266,
    longitude: 112.9834,
    scale: 10,

    covers: []
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');

    let that = this;
    wx.request({
      url: 'http://localhost:8080/' + 'locations',
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync('cookieKey')
      },
      success: function (res) {
        that.setData({
          latitude: res.data[0].latitude,
          longitude: res.data[0].longitude,
          scale: 10,
          covers: res.data
        })
      }
    })
  },

  show5A: function (event) {
    this.setData({
      latitude: 36.5,
      longitude: 104,
      scale: 1
    });

    let that = this;
    wx.request({
      url: 'http://localhost:8080/' + 'fiveA',
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync('cookieKey')
      },
      success: function (res) {
        that.setData({
          covers: res.data
        })
      }
    })
  }
})
