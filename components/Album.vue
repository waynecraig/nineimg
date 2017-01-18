<template>
    <div class="album">
        <div class="user">
            <img v-bind:src="user.headimgurl"/>
            <p>{{user.nickname}}</p>
        </div>
        <div class="empty" v-if="posts.length===0">您还没有发动态，快来试试吧~</div>
        <div class="item" v-for="(post,i) in posts">
            <div v-if="shouldShowYear(i)&&shouldShowDate(i)" class="year">
                {{getYear(post.createTime)}}
            </div>
            <div class="data">
                <p class="datetime">
                    <span v-if="shouldShowDate(i)" class="date">{{getDate(post.createTime)}}</span>
                    <span v-if="shouldShowDate(i)" class="month">{{getMonth(post.createTime)}}</span>
                </p>
                <div class="matrix">
                    <div class="layer">
                        <div v-for="j in 4" class="cell" v-bind:style="styles[j-1]">
                            <img v-if="post" v-bind:src="imgurl(post, j)" v-on:click="preview(post, j)"/>
                        </div>
                    </div>
                </div>
                <span class="info">共9张</span>
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
            W: window.innerWidth * 0.198,
            M: window.innerWidth * 0.001,
            N: 2
        }
    },
    computed: mapGetters({
        user: 'curInfo',
        posts: 'albumData'
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
            const id = this.$route.params.id;
            this.$store.dispatch('setCurUser', id);
            this.$store.dispatch('fetchPosts', {
                userId: id,
                userIds: this.$store.getters.userIds,
                startTime: this.$store.getters.albumMaxTime
            });
        },
        getDate: function(t) {
            const d = new Date(t);
            const s = d.getDate().toString();
            return s.length === 1 ? '0'+s : s;
        },
        getMonth: function(t) {
            const d = new Date(t);
            return (d.getMonth() + 1) + '月';
        },
        getYear: function(t) {
            return new Date(t).getFullYear() + '年';
        },
        shouldShowDate: function(i) {
            if (i === 0) return true;
            const d1 = this.getDate(this.posts[i-1]);
            const m1 = this.getMonth(this.posts[i-1]);
            const d2 = this.getDate(this.posts[i]);
            const m2 = this.getMonth(this.posts[i]);
            return d1 !== d2 || m1 !== m2;
        },
        shouldShowYear: function(i) {
            if (i === 0) return false;
            return this.getYear(this.posts[i-1]) !== this.getYear(this.posts[i]);
        },
        formatTime: function(t) {
            return formatDate(new Date(t), 'MM-DD');
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

.album {
    padding-bottom: 5vw;
}

.album .user {
    display: flex;
    align-items: flex-end;
    border-bottom: solid 1px #ccc;
}
.album .user img {
    height: 60px;
    width: 60px;
    margin: 10px;
}
.album .user p {
    margin: 10px;
    font-size: 20px;
}

.album .year {
    margin: 10vw 2vw 5vw 2vw;
    font-size: 35px;
    font-weight: 500;
}

.album .item {
    margin: 5vw 2vw;
}

.album .item .data {
    display: flex;
}
.album .item .data .datetime {
    width: 20vw;
}
.album .item .data .datetime .date {
    font-size: 30px;
    font-weight: 900;
}
.album .item .data .datetime .month {
    font-size: 12px;
    font-weight: 500;
}
.album .item .data .matrix {
    width: 20vw;
    height: 20vw;
    min-height: 20vw;
    margin: 0;
    border: 0;
}
.album .info {
    align-self: flex-end;
    margin: 0 5px;
    color: #666;
    font-size: 12px;
}

.album .empty {
    line-height: 70vh;
    font-size: 20px;
    text-align: center;
    color: #666;
}

</style>
