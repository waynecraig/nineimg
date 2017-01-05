var Vue = require('./vue');
var VueTouch = require('vue-touch-easyhi');
Vue.use(VueTouch);

require('./matrix');
require('./templates');
require('./buttons');
require('./tip');
require('./result');

var actions = require('./actions');

var app = new Vue({
    el: '#app',
    data: {
        userImg: '',
        serverId: '',
        uploadId: 0,
        tpls: [
            './img/pic1.jpg', 
            './img/pic2.jpg',
            './img/pic3.jpg',
            './img/pic4.jpg',
            './img/pic5.jpg'
        ],
        tplIndex: 0,
        buildId: 0,
        canSave: 0,
        completed: 0
    },
    computed: {
        layers: function() {
            return [this.userImg/*, this.tpls[this.tplIndex]*/];
        }
    },
    methods: {
        selectTpl: function(i) {
            this.tplIndex = i;
        },
        onUpload: function() {
            var that = this;
            //that.uploadId += 1;
            //var uploadId = that.uploadId;
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function (res) {
                    //if (uploadId !== that.uploadId) return;
					that.userImg = res.localIds[0];
                    that.serverId = '';
                    that.buildId = 0;
                    that.canSave = 0;
                    wx.uploadImage({
                        localId: that.userImg, // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 0, // 默认为1，显示进度提示
                        success: function (res) {
                            //if (uploadId !== that.uploadId) return;
                            that.serverId = res.serverId; // 返回图片的服务器端ID
                            actions.uploadImg(that.serverId).then(function(buildId){
                                that.canSave = 1;
                            });
                        }
                    });

				}
			});
        },
        onSave: function() {
            if (!this.canSave) return;
            var that = this;
            var L = that.$refs.M.$refs.L[0];
            actions.saveImg({
                id: that.serverId,
                w: L.w,
                h: L.h,
                scale: L.scale,
                x: L.x,
                y: L.y,
                W: L.W,
                //tpl: this.tpls[this.tplIndex]
            }).then(buildId=>{
                that.completed = 1;
                that.buildId = buildId;
            });
        },
        onBack: function() {
            this.completed = 0;
            this.buildId = 0;
        }
    },
    template: `
        <div class="wrap">
            <matrix v-if="!completed" :layers="layers" ref="M"/>
            <result v-if="completed" :serverId="serverId" :buildId="buildId"/>
            <templates v-if="false" :tpls="tpls" :selectTpl="selectTpl"/>
            <tip v-if="completed"/>
            <buttons :canSave="canSave" :completed="completed" :onUpload="onUpload" :onSave="onSave" :onBack="onBack"/>
        </div>
    `
});
