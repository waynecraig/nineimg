import * as types from '../mutation-types'
import api from '../../api'

// initial state
const state = {
    all: [],
    maxTime: undefined,
    deleting: false,
    expose: {}
}

// getters
const getters = {
    allRecords: state => state.all
}

// actions
const actions = {
    deletePost: ({commit}, id) => {
        commit(types.START_DELETE);
        return api.deletePost(id)
        .then(()=>{
            commit(types.DELETE_SUCCESS, id)
            alert('删除成功');
        }).catch(e=>{
            commit(types.DELETE_FAIL)
            alert('删除失败');
        });
    },
    setExpose: ({commit}, id) => {
        commit(types.SET_EXPOSE, id);
    }
}

// mutations
const mutations = {
    [types.RECEIVE_POSTS] (state, posts) {
        state.all = state.all.filter(d=>!posts.find(p=>p._id===d._id))
            .concat(posts).sort((a,b)=>b.createTime-a.createTime);
    },
    [types.SET_MAX_TIME] (state, maxTime) {
        state.maxTime = maxTime;
    },
    [types.START_DELETE] (state) {
        state.deleting = true;
    },
    [types.DELETE_SUCCESS] (state, id) {
        state.deleting = false;
        state.all = state.all.filter(d=>d._id!==id);
    },
    [types.DELETE_FAIL] (state) {
        state.deleting = false;
    },
    [types.SET_EXPOSE] (state, id) {
        state.expose[id] = true;
        state.expose = Object.assign({}, state.expose);
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
