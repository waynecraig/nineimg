<template>
    <div class="list">
        <div class="empty" v-if="posts.length === 0">还没有人发动态~</div>
        <div v-for="post in posts" class="post">
            <img class="avatar" v-bind:src="post.headimgurl" v-on:click="toAlbum(post.userId)"/>
            <div class="postdata">
                <p class="name" v-on:click="toAlbum(post.userId)">{{post.nickname}}</p>
                <div class="matrix" ref="M">
                    <div class="layer">
                        <div 
                            v-for="i in 9" 
                            class="cell" 
                            v-bind:style="cellStyle(post,i)"
                            v-on:click="preview(post, i)"
                        >
                            <img v-if="post.exposed" v-bind:src="imgurl(post, i)"/>
                        </div>
                    </div>
                </div>
                <div class="bar">
                    <span class="time">{{getTime(post.createTime)}}</span>
                    <span class="delete" v-if="post.userId===me" v-on:click="deletePost(post._id)">删除</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

const mapState = require('vuex').mapState;
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
    computed: Object.assign(mapState({
        me: state => state.users.me
    }),mapGetters({
        posts: 'listData'
    }),{
        H: function() {
            return this.W + this.M * 2 + window.innerWidth * 0.09 + 45;
        }
    }),
    created: function() {
        this.fetchPosts();
        window.addEventListener('scroll', this.onScroll);
        var that = this;
        setTimeout(function(){that.expose()}, 500);
    },
    destroyed: function() {
        window.removeEventListener('scroll', this.onScroll);
    },
    watch: {
        '$route': 'fetchPosts'
    },
    methods: {
        fetchPosts: function(isMore) {
            const options = {
                userIds: this.$store.getters.userIds
            }
            if (isMore) {
                options.startTime = this.$store.state.posts.maxTime;
            }
            this.$store.dispatch('fetchPosts', options);
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
                this.fetchPosts(true);
			}
            this.expose();
        },
        deletePost: function(id) {
            const sure = confirm('确定要删除这条记录?');
            if (sure) {
                this.$store.dispatch('deletePost', id);
            }
        },
        expose: function() {
			var scrollTop = Math.max(window.pageYOffset || 0, document.body.scrollTop);
            var i1 = Math.floor(scrollTop / this.H);
            var i2 = Math.ceil((scrollTop + document.documentElement.clientHeight) / this.H);
            for (var i = i1; i < i2; i++) {
                if (i < this.posts.length) {
                    this.$store.dispatch('setExpose', this.posts[i]._id);
                }
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

.list .post .bar {
    margin-top: 5px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
}

.list .post .bar .time {
    color: #666;
}

.list .post .bar .delete {
    color: blue;
    float: right;
}

.list .empty {
    line-height: 90vh;
    font-size: 25px;
    text-align: center;
    color: #666;
}

</style>
