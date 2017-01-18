<template>
    <div class="list" v-on:scroll="onScroll">
        <div class="empty" v-if="posts.length === 0">还没有人发动态~</div>
        <div v-for="post in posts" class="post">
            <img class="avatar" v-bind:src="post.headimgurl" v-on:click="toAlbum(post.userId)"/>
            <div class="postdata">
                <p class="name" v-on:click="toAlbum(post.userId)">{{post.nickname}}</p>
                <div class="matrix">
                    <div class="layer">
                        <div v-for="i in 9" class="cell" v-bind:style="styles[i-1]">
                            <img v-if="post" v-bind:src="imgurl(post, i)" v-on:click="preview(post, i)"/>
                        </div>
                    </div>
                </div>
                <p class="time">{{getTime(post.createTime)}}</p>
            </div>
        </div>
    </div>
</template>

<script>

const mapGetters = require('vuex').mapGetters;
const ResMixin = require('./ResMixin.vue');
const formatDate = require('../lib/formatDate');
module.exports = {
    mixins: [ResMixin],
    data: function() {
        return {
            W: window.innerWidth * 0.68,
            M: window.innerWidth * 0.01,
        }
    },
    computed: mapGetters({
        posts: 'listData'
    }),
    created: function() {
        this.fetchPosts();
        window.addEventListener('scroll', this.onScroll);
    },
    destroyed: function() {
        window.removeEventListener('scroll', this.onScroll);
    },
    watch: {
        '$route': 'fetchPosts'
    },
    methods: {
        fetchPosts: function() {
            this.$store.dispatch('fetchPosts', {
                userIds: this.$store.getters.userIds,
				startTime: this.$store.getters.maxTime
            });
        },
        getTime: function(t) {
            const d = (Date.now() - t) / 1000;
            if (d < 60) {
                return '刚刚';
            } else if (d < 60 * 60) {
                return Math.floor(d/60) + '分钟前';
            } else if (d < 60 * 60 * 24) {
                return Math.floor(d/60/60) + '小时前';
            } else if (d < 60 * 60 * 24 * 30) {
                const dd = new Date().getDate() - new Date(t).getDate();
                if (dd === 1) {
                    return '昨天';
                } else if (dd === 2) {
                    return '前天';
                } else {
                    return dd + '天前';
                }
            } else if (d < 60 * 60 * 24 * 365) {
                const dd = new Date().getMonth() - new Date(t).getMonth();
                if (dd === 1) {
                    return '上个月';
                } else {
                    return dd + '个月前';
                }
            } else {
                const dd = new Date().getFullYear() - new Date(t).getFullYear();
                if (dd === 1) {
                    return '去年';
                } else if (dd === 2) {
                    return '前年';
                } else {
                    return dd + '年前';
                }
            }
        },
        toAlbum: function(id) {
            this.$router.push('/album/'+id);
        },
        onScroll: function(e) {
			var scrollTop = Math.max(window.pageYOffset || 0, document.body.scrollTop);
			if (document.documentElement.clientHeight + scrollTop >= document.documentElement.scrollHeight - 10) {
                this.fetchPosts();
			}
        }
    }
}

</script>

<style>

.list .post {
    margin: 2vw;
    border-bottom: solid 1px #ccc;
    padding: 10px 0;
    display: flex;
}

.list .post .avatar {
    margin: 0 2vw 0 0;
    width: 13vw;
    height: 13vw;
}
.list .post .name {
    font-size: 5vw;
    line-height: 7vw;
    color: #727898;
}
.list .post .matrix {
    width: 70vw;
    height: 70vw;
    min-height: 70vw;
    margin: 0;
    border: 0;
}

.list .post .time {
    font-size: 12px;
    color: #666;
}

.list .empty {
    line-height: 90vh;
    font-size: 25px;
    text-align: center;
    color: #666;
}

</style>
