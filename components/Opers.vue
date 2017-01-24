<template>
    <div class="opers">
        <div class="oper" v-on:click="uploadImg">{{uploadText}}</div>
        <div 
             v-bind:class="canSave?'oper':'oper disable'" 
             v-on:click="saveImg"
         >保存</div>
    </div>
</template>

<script>

const mapState = require('vuex').mapState;
const mapAction = require('vuex').mapAction;
const mapGetters = require('vuex').mapGetters;
module.exports = {
    computed: Object.assign(
        mapGetters(['canSave']),
        mapState({
            uploaded: state => state.board.uploaded,
            uploadText: state => (state.board.uploaded ? '重新' : '') + '上传',
        })
    ),
    methods: {
        uploadImg: function() {
            this.$store.dispatch('uploadImg');
        },
        saveImg: function() {
            if (!this.uploaded) return;
            var that = this;
            this.$store.dispatch('saveImg', this.$parent.getAdjustInfo()).then(postId => {
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
