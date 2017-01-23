<template>
    <div class="loading" v-on:touchstart="onTouchStart">
        <div class="message">
            <p>{{text}}</p>
        </div>
    </div>
</template>

<script>

module.exports = {
    props: ['text'],
    methods: {
        onTouchStart: function(e) {
            e.preventDefault();
        }
    }
}

</script>

<style>

.loading {
    z-index: 100;
    position: fixed;
    width: 100vw;
    height: 90vh;
    background: rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.loading .message {
    width: 40vw;
    height: 40vw;
    background: rgba(0,0,0,0.7);
    margin: 0 auto;
    border-radius: 20px;
}

.loading .message p {
    line-height: 40vw;
    font-size: 20px;
    color: #eee;
    text-align: center;
}

</style>
