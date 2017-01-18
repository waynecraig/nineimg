<template>
    <div class="opers">
        <div class="oper" v-on:click="uploadImg">上传</div>
        <div v-bind:class="saveClass" v-on:click="saveImg">保存</div>
    </div>
</template>

<script>

const mapState = require('vuex').mapState;
const mapAction = require('vuex').mapAction;
module.exports = {
    computed: mapState({
        uploaded: state => state.board.uploaded,
        saveClass: state => "oper" + (state.board.uploaded ? '' : ' disable')
    }),
    methods: {
        uploadImg: function() {
            this.$store.dispatch('uploadImg');
        },
        saveImg: function() {
            if (!this.uploaded) return;
            var that = this;
            this.$store.dispatch('saveImg', this.$parent.getAdjustInfo()).then(postId => {
                alert(postId);
                that.$router.push('/detail/' + postId);
            });
        }
    }
}

</script>

<style>
.opers {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 96vw;
    margin: 2vw;
}
.opers .oper {
    text-align: center;
    color: #fff;
    background-color: #3498db;
    height: 8vh;
    line-height: 8vh;
    font-size: 3vh;
}
.opers .oper.disable {
    background-color: #95a5a6;
}
</style>
