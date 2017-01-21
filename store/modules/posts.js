import * as types from '../mutation-types'

// initial state
const state = {
    all: []
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
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
