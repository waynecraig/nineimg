<template>
    <div class="loading">
        <div class="message">
            <p>{{text}}</p>
        </div>
    </div>
</template>

<script>

module.exports = {
    props: ['text']
}

</script>

<style>

.loading {
    z-index: 10;
    position: fixed;
    width: 100%;
    height: 100%;
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
