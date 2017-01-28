<template>
    <div class="detail">
        <div class="matrix">
            <div class="layer">
                <div v-for="i in 9" class="cell" v-bind:style="cellStyle(post,i)">
                    <img v-if="post" v-bind:src="imgurl(post, i)" v-on:click="preview(post, i)"/>
                    <p v-if="!post">loading...</p>
                </div>
            </div>
        </div>
        <div class="tip">依次点击以上图片可以预览和保存</div>
    </div>
</template>

<script>

const ResMixin = require('./ResMixin.vue');
module.exports = {
    mixins: [ResMixin],
    computed: {
        post: function() {
            const id = this.$route.params.id;
            const p = this.$store.state.posts.all.filter(d=>id===d._id)[0];
            if (!p) {
                this.$store.dispatch('fetchPosts', {id});
            }
            return p;
        }
    }
}

</script>

<style>
.detail {
    display: flex;
    flex-direction: column;
    height: 90vh;
}
.cell img {
    width: 100%;
    height: 100%;
}
.cell p {
	text-align: center;
}
.tip {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 96vw;
    margin: 2vw;
    font-size: 6vw;
}
</style>
