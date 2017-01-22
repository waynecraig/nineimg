import * as types from '../mutation-types'

// initial state
const state = {
    all: [],
    maxTime: undefined
}

// getters
const getters = {
    allRecords: state => state.all
}

// actions
const actions = {
}

// mutations
const mutations = {
    [types.RECEIVE_POSTS] (state, posts) {
        state.all = state.all.filter(d=>!posts.find(p=>p._id===d._id))
            .concat(posts).sort((a,b)=>b.createTime-a.createTime);
    },
    [types.SET_MAX_TIME] (state, maxTime) {
        state.maxTime = maxTime;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
