<template>
    <div class="design">
        <matrix :layers="layers" ref="M"/>
        <opers/>
    </div>
</template>

<script>

const Matrix = require('./Matrix.vue');
const Opers = require('./Opers.vue');
const mapState = require('vuex').mapState;
module.exports = {
    components: { Matrix, Opers },
    computed: mapState({
        layers: state => state.board.localId ? [state.board.localId, '/img/qrlayer.png'] : []
    }),
    methods: {
        getAdjustInfo: function() {
            const L = this.$refs.M.$refs.L[0];
            const L1 = this.$refs.M.$refs.L[1];
            const tpl = L1 && L1.img;
            return {
                id: this.$store.state.board.serverId,
                w: L.w,
                h: L.h,
                scale: L.scale,
                x: L.x,
                y: L.y,
                W: L.W,
                tpl: tpl
            }
        }
    }
}

</script>

<style>

.design {
    display: flex;
    flex-direction: column;
    height: 90vh;
}

</style>
