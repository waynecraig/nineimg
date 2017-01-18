<script>
module.exports = {
    computed: {
		styles: function() {
            const s = [];
            const W = this.W || window.innerWidth * 0.94;
            const M = this.M ||  window.innerWidth * 0.01;
            const N = this.N || 3;
            const d  = W / N;
            const D = d + M;
            for (var i = 0; i < (N*N); i++) {
                const c = i % N;
                const r = Math.floor(i / N);
                s.push({
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
        imgurl: function(p, i) {
            return '/data/' + p.serverId + '/' + p.buildId + '/' + i + '.png';
        },
        preview: function(post, i) {
            wx.previewImage({
                current: location.origin + this.imgurl(post, i),
                urls: [1,2,3,4,5,6,7,8,9].map(d=>location.origin + this.imgurl(post, d))
            });
        }
    }
}
</script>
