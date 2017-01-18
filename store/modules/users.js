import * as types from '../mutation-types'

// initial state
const c = document.cookie.match(/id=([^;]+)/);
const id = c && c[1];
const state = {
    infos: {},
    me: id,
    cur: ''
}

// getters
const getters = {

    myInfo: state => state.infos[state.me] || {},

    curInfo: state => state.infos[state.cur] || {},

    userIds: state => Object.keys(state.infos)

}

// actions
const actions = {
    setCurUser ({ commit }, id) {
        commit(types.SET_CUR_USER, id);
    }
}

// mutations
const mutations = {
    [types.RECEIVE_USERS] (state, users) {
        users.map(u => state.infos[u._id] = u);
        state.infos = Object.assign({}, state.infos);
    },
    [types.SET_CUR_USER] (state, id) {
        state.cur = id;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
