<template>
    <div class="layer">
        <div v-for="i in 9" class="cell" v-bind:style="styles[i-1]"></div>
    </div>
</template>

<script>

const ResMixin = require('./ResMixin.vue');
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
    computed: {
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
                s.push({
                    backgroundImage: 'url(' + this.img + ')',
                    backgroundSize: this.w * scale + 'px ' + this.h * scale + 'px',
                    backgroundPosition: (x - c * d) + 'px ' + (y - r * d) + 'px',
                    width: d + 'px',
                    height: d + 'px',
                    left: c * D + 'px',
                    top: r * D + 'px'
                });
            }
            return s;
        }
    },
    methods: {
        updateImgSize: function() {
            if (this.img) {
                var p = new Image();
                var that = this;
                p.onload = function(){
                    that.scale = that.W / Math.min(this.width, this.height);
                    that.w = this.width;
                    that.h = this.height;
                    that.x = 0;
                    that.y = 0;
                };
                p.src = this.img;
            }
        },
        onPanStart: function(e) {
            this.deltaX = e.deltaX;
            this.deltaY = e.deltaY;
        },
        onPanMove: function(e) {
            this.deltaX = e.deltaX;
            this.deltaY = e.deltaY;
        },
        onPanEnd: function(e) {
            this.x += this.deltaX;
            this.deltaX = 0;
            this.y += this.deltaY;
            this.deltaY = 0;
        },
        onPinchStart: function(e) {
            this.x -= e.deltaX;
            this.y -= e.deltaY;
            this.onPinchMove(e);
        },
        onPinchMove: function(e) {
            this.dScale = e.scale;
            this.deltaX = e.deltaX + (1 - e.scale) * (e.center.x - this.x);
            this.deltaY = e.deltaY + (1 - e.scale) * (e.center.y - this.y);
        },
        onPinchEnd: function(e) {
            this.onPinchMove(e);
            this.scale *= this.dScale;
            this.dScale = 1;
            this.x += this.deltaX;
            this.deltaX = 0;
            this.y += this.deltaY;
            this.deltaY = 0;
        },
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
