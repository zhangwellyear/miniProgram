Page({

  data: {
    scrollH: 0,
    device_wid: 0,
    loadingCount: 0,
    images: [],
    images_display: []
  },

  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        
        that.setData({
          scrollH: wh,
          device_wid: ww
        }),

        that.loadImages();
      },
    })
  },

  loadImages: function () {
    let that = this;

    wx.request({
      url: 'http://localhost:8080/upload/',
      method: 'POST',
      data: {
        device_width: this.data.device_wid
      },
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function (res) {
        let image_objs = res.data;
        that.setData({
          loadingCount: image_objs.length,
          images: image_objs
        });
      }
    });
  },

  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgWid = e.detail.width;         // 图片的原始宽度
    let oImgHeight = e.detail.height;     // 图片的原始高度
    
    let scale = this.data.device_wid / oImgWid; // 计算图片显示的方所比例
    let imgDisplayHeight = oImgHeight * scale;  // 计算图片的显示高度

    let images = this.data.images;
    let display_img = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        display_img = img;
        break;
      }
    }

    let images_display = this.data.images_display;

    display_img.height = imgDisplayHeight;  // 设置图片的显示高度
    images_display.push(display_img);
    let loadingCount = this.data.loadingCount - 1;

    let data = {
      loadingCount: loadingCount,
      images_display: images_display
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  /**
   * 翻转图片
   */

  /**
   * 地理位置的处理
   */
  go_position: function (event) {
    console.log(event);
    wx.navigateTo({
      url: '/pages/map/index/index?geo_name=' + event._relatedInfo.anchorTargetText,
    })
    console.log(event.currentTarget.id);
  }
})