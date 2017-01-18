<template>
    <div 
        class="matrix"
        v-touch:panstart="onPanStart"
        v-touch:panmove="onPanMove"
        v-touch:panend="onPanEnd"
        v-touch:pinchstart="onPinchStart"
        v-touch:pinchmove="onPinchMove"
        v-touch:pinchend="onPinchEnd"
    >
        <layer v-for="img in layers" :img="img" ref="L"/>
    </div>
</template>

<script>
    
const Layer = require('./Layer.vue')
module.exports = {
    components: { Layer },
    props: ['layers'],
    methods: {
        onPanStart: function(e) {
            this.$refs.L[0].onPanStart(e);
        },
        onPanMove: function(e) {
            this.$refs.L[0].onPanMove(e);
        },
        onPanEnd: function(e) {
            this.$refs.L[0].onPanEnd(e);
        },
        onPinchStart: function(e) {
            this.$refs.L[0].onPinchStart(e);
        },
        onPinchMove: function(e) {
            this.$refs.L[0].onPinchMove(e);
        },
        onPinchEnd: function(e) {
            this.$refs.L[0].onPinchEnd(e);
        }
    }
}

</script>

<style>

.matrix {
    position: relative;
    width: 96vw;
    height: 96vw;
    min-height: 96vw;
    margin: 2vw;
    border: solid #ccc 1px;
}

</style>
