<template>
    <div class="layer">
        <div 
            v-for="i in 9" 
            class="cell" 
            v-bind:style="styles[i-1]"
            v-on:transitionend="onTransitionEnd"
        ></div>
    </div>
</template>

<script>

const ResMixin = require('./ResMixin.vue');
const mapState = require('vuex').mapState;
module.exports = {
    props: ['img'],
    data: function () {
        this.updateImgSize();
        return {
            w: 0,
            h: 0,
            scale: 1,
            x: 0,
            y: 0,
            deltaX: 0,
            deltaY: 0,
            dScale: 1,
            W: window.innerWidth * 0.94,
            M: window.innerWidth * 0.01
        }
    },
    computed: Object.assign({
		styles: function() {
            var s = [];
            var d  = this.W / 3;
            var D = d + this.M;
            var x = this.x + this.deltaX;
            var y = this.y + this.deltaY;
            var scale = this.scale * this.dScale;
            for (var i = 0; i < 9; i++) {
                var c = i % 3;
                var r = Math.floor(i / 3);
                var style = {
                    backgroundImage: 'url(' + this.img + ')',
                    backgroundSize: this.w * scale + 'px ' + this.h * scale + 'px',
                    backgroundPosition: (x - c * d) + 'px ' + (y - r * d) + 'px',
                    width: d + 'px',
                    height: d + 'px',
                    left: c * D + 'px',
                    top: r * D + 'px'
                };
                if (this.adjusting) {
                    style.transition = 'all 0.5s';
                }
                s.push(style);
            }
            return s;
        }
    }, mapState({
        handling: state => state.board.handling,
        adjusting: state => state.board.adjusting,
    })),
    methods: {
        updateImgSize: function() {
            if (this.img) {
                var p = new Image();
                var that = this;
                p.onload = function(){
                    var scale = that.W / Math.min(this.width, this.height);
                    var maxScale = that.W / 300;
                    if (scale > maxScale) {
                        that.$store.dispatch('setInvalidImg');
                        alert('图片分辨率太低，请选择其他图片');
                    } else {
                        that.maxScale = maxScale;
                        that.scale = that.minScale = scale;
                        that.w = this.width;
                        that.h = this.height;
                        that.x = 0;
                        that.y = 0;
                    }
                };
                p.src = this.img;
            }
        },
        onPanStart: function(e) {
            if (this.adjusing) return;
            this.$store.dispatch('startHandle');
            this.deltaX = e.deltaX;
            this.deltaY = e.deltaY;
        },
        onPanMove: function(e) {
            if (this.adjusing) return;
            this.deltaX = e.deltaX;
            this.deltaY = e.deltaY;
        },
        onPanEnd: function(e) {
            this.x += this.deltaX;
            this.deltaX = 0;
            this.y += this.deltaY;
            this.deltaY = 0;
            this.adjust();
            this.$store.dispatch('stopHandle');
        },
        onPinchStart: function(e) {
            if (this.adjusing) return;
            this.$store.dispatch('startHandle');
            this.x -= e.deltaX;
            this.y -= e.deltaY;
            this.onPinchMove(e);
        },
        onPinchMove: function(e) {
            if (this.adjusing) return;
            this.dScale = e.scale;
            this.deltaX = e.deltaX + (1 - e.scale) * (e.center.x - this.x);
            this.deltaY = e.deltaY + (1 - e.scale) * (e.center.y - this.y);
        },
        onPinchEnd: function(e) {
            e && this.onPinchMove(e);
            this.scale *= this.dScale;
            this.dScale = 1;
            this.x += this.deltaX;
            this.deltaX = 0;
            this.y += this.deltaY;
            this.deltaY = 0;
            this.adjust();
            this.$store.dispatch('stopHandle');
        },
        zoomFromCenter: function(scale) {
            var c = this.W / 2;
            var ds = 1 - scale / this.scale;
            this.x += ds * (c - this.x);
            this.y += ds * (c - this.y);
            this.scale = scale;
            this.dScale = 1;
        },
        adjust: function() {
            if (this.dScale !== 1) {
                return this.onPinchEnd();
            }
            var that = this;
            [
                { c: ()=>that.scale>that.maxScale, u: ()=>that.zoomFromCenter(that.maxScale) },
                { c: ()=>that.scale<that.minScale, u: ()=>that.zoomFromCenter(that.minScale) },
                { c: ()=>that.x>0, u: ()=>that.x=0 },
                { c: ()=>that.y>0, u: ()=>that.y=0 },
                { c: ()=>that.x<that.W-that.w*that.scale, u: ()=>that.x=that.W-that.w*that.scale },
                { c: ()=>that.y<that.W-that.h*that.scale, u: ()=>that.y=that.W-that.h*that.scale },
            ].map(({c, u}) => {
                if (c()) {
                    that.$store.dispatch('startAdjust');
                    u();
                }
            });
        },
        onTransitionEnd: function() {
            this.$store.dispatch('stopAdjust');
        }
    },
    watch: {
        img: function(val, oldVal) {
            this.updateImgSize();
        }
    }
}

</script>

<style>
.layer {
    position: absolute;
}
.cell {
    background-repeat: no-repeat;
    position: absolute;
}
.cell img {
    width: 100%;
    height: 100%;
}
</style>
