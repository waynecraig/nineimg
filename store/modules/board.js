import * as types from '../mutation-types'
import api from '../../api'

// initial state
const state = {
    localId: '',
    serverId: '',
    uploaded: false
}

// getters
const getters = {
}

// actions
const actions = {
    uploadImg ({commit}) {
        return api.chooseImg().then(localId => {
            commit(types.SET_LOCAL_ID, localId);
            return localId;
        }).then(api.wxUploadImg).then(serverId => {
            commit(types.SET_SERVER_ID, serverId);
            return serverId;
        }).then(api.uploadImg).then(() => {
            commit(types.UPLOAD_IMG);
        });
    }
}

// mutations
const mutations = {
    [types.SET_LOCAL_ID] (state, id) {
        state.localId = id;
        state.serverId = '';
        state.uploaded = false;
    },
    [types.SET_SERVER_ID] (state, id) {
        state.serverId = id;
    },
    [types.UPLOAD_IMG] (state) {
        state.uploaded = true;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
