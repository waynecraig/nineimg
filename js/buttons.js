var Vue = require('./vue');

Vue.component('buttons', {
    props: ['canSave', 'completed', 'onUpload', 'onSave', 'onBack'],
    computed: {
        saveStyle: function() {
            return this.canSave ? {} : {color: '#ccc'};
        }
    },
    template: `
        <div class="buttons">
            <div v-if="!completed" v-on:click="onUpload">上传</div>
            <div v-if="!completed" v-on:click="onSave" v-bind:style="saveStyle">保存</div>
            <div v-if="completed" v-on:click="onBack">返回</div>
        </div>
    `
})
