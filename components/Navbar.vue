<template>
    <ul class="navbar">
        <router-link v-for="btn in btns" :to="btn.link" tag="li">
            <a>{{btn.text}}</a>
        </router-link>
    </ul>
</template>

<script>
export default {
    data: function() {
        const id = this.$store.state.users.me;
        return {
            btns: [{
                    text: '全部',
                    link: '/list'
                },{
                    text: '制作',
                    link: '/design'
                },{
                    text: '我的',
                    link: id ? ('/album/' + id) : '/login'
                }
            ]
        }
    },
    watch: {
        $route: function(val, oldVal) {
            if (val.path === '/login') {
                location.reload();
            }
        }
    }
}
</script>

<style>

.navbar {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100vw;
    list-style: none;
    background-color: #ecf0f1;
}
.navbar li {
    flex: 1;
    text-align: center;
    border-top: 1px solid #bdc3c7;
    height: 10vh;
    line-height: 10vh;
    font-size: 4vh;
}
.navbar li a {
    text-decoration: none;
    color: #7f8c8d;
}
.navbar li.router-link-active a {
    color: #27ae60;
}

</style>
