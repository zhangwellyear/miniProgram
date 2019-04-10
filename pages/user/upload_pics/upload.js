Page({
  data: {
    pics: [],
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isShow: true,
    geo_name: '',
    latitude: '',
    longitude: '',
    pics: []
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    isShow: (options.isShow == "true" ? true : false)
  },

  // 图片上传
  chooseImage: function () {
    var that = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        if (pics.length >= 9) {
          that.setData({
            isShow: (!that.data.isShow)
          })
        } else {
          that.setData({
            isShow: (that.data.isShow)
          })
        }
        that.setData({
          pics: pics
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  // 图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  },

  /**
   * 获取地理坐标
   */
  get_geo: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        let name = res.name;   // 位置名称
        let latitude = res.latitude;  // 纬度
        let longitude = res.longitude;  // 经度

        that.setData({
          geo_name: name,
          latitude: latitude,
          longitude: longitude
        })
      },
    });
  },

  /**
   * 图片上传封装函数
   */
  upload_func: function (pic_obj) {
    let that = this;
    
    const uploadTsk = wx.uploadFile({
      url: 'http://localhost:8080/pics_upload',
      filePath: pic_obj.url,
      name: 'image',
      header: {
        "Content-Type": "multipart/form-data",
        'cookie': wx.getStorageSync('cookieKey')
      },
      // 上传图片时携带的数据
      formData: {
        'url': pic_obj.url,
        'pic_type': pic_obj.type,
        'pic_topic': pic_obj.topic,
        'pic_des': pic_obj.desc,
        'pic_content': pic_obj.content,
        'pic_geo': that.data.geo_name,
        'pic_latitude': that.data.latitude,
        'pic_longitude': that.data.longitude
      },
      success: function (res) {
        let data = res.data;
      },

      fail: function () {
      }
    })
  },

  /**
   * 上传图片
   */
  upload_pics: function (event) {
    let pic_obj = {};
    /**
     * 获取并上传图片信息部分
     */
    pic_obj.type = event.detail.value.type;
    pic_obj.topic = event.detail.value.topic;
    pic_obj.desc = event.detail.value.desc;
    pic_obj.content = event.detail.value.content;

    /**
     * 上传图片部分
     */
    let pics = this.data.pics;
    let that = this;
    
    const promises = pics.map(function (pic, idx) {
      pic_obj.url = pic;
      that.upload_func(pic_obj);
    });

    Promise.all(promises).then(() => {
      wx.navigateBack({})
    })
  }
})