<script>
module.exports = {
    methods: {
        cellStyle: function(p, i) {
            const s = [];
            const W = this.W || window.innerWidth * 0.94;
            const M = this.M ||  window.innerWidth * 0.01;
            const N = this.N || 3;
            const d  = W / N;
            const D = d + M;
            const c = (i-1) % N;
            const r = Math.floor((i-1) / N);
            s.push({
                width: d + 'px',
                height: d + 'px',
                left: c * D + 'px',
                top: r * D + 'px',
                backgroundImage: 'url(' + this.burl(p, i) + ')',
                backgroundSize: '100% 100%'
            });
            return s;
        },
        burl: function(p, i) {
            return '/thumb/' + p.serverId + '/' + p.buildId + '/' + i + '.png';
        },
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
