<template>
    <div class="wrap">
        <div class="content">
            <router-view/>
        </div>
        <navbar/>
    </div>
</template>

<script>

const Navbar = require('./Navbar.vue')
module.exports = {
    components: { navbar: Navbar }
}

</script>

<style>

*{
    padding: 0;
    margin: 0;
}
.wrap {
}
.content {
    min-height: 90vh;
    margin-bottom: 10vh;
}

</style>
