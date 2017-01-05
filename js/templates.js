var Vue = require('./vue');

Vue.component('templates', {
    props: ['tpls', 'selectTpl'],
    template: `
        <div class="templates">
            <div class="list">
                <img v-for="(tpl,i) in tpls" v-bind:src="tpl" v-on:click="selectTpl(i)"/>
            </div>
        </div>
    `
})
