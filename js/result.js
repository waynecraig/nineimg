var Vue = require('./vue');

Vue.component('result', {
    props: ['serverId', 'buildId'],
    data: function () {
        return {
            W: window.innerWidth * 0.94,
            M: window.innerWidth * 0.01
        }
    },
    computed: {
        styles: function() {
            var s = [];
            var d  = this.W / 3;
            var D = d + this.M;
            for (var i = 0; i < 9; i++) {
                var c = i % 3;
                var r = Math.floor(i / 3);
                s.push({
                    width: d + 'px',
                    height: d + 'px',
                    left: c * D + 'px',
                    top: r * D + 'px'
                });
            }
            return s;
        },
    },
    methods: {
        imgurl: function(i) {
            return './data/' + this.serverId + '/' + this.buildId + '/' + i + '.png';
        }
    },
    template: `
        <div class="matrix">
            <div class="layer">
                <div v-for="i in 9" class="cell" v-bind:style="styles[i-1]">
                    <img v-if="buildId" v-bind:src="imgurl(i)"/>
                    <p v-if="!buildId">loading...</p>
                </div>
            </div>
        </div>
    `
})
