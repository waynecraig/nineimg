import * as types from '../mutation-types'
import api from '../../api'

// initial state
const state = {
    localId: '',
    serverId: '',
    uploaded: false,
    uploading: false,
    saving: false
}

// getters
const getters = {
}

// actions
const actions = {
    uploadImg ({commit}) {
        commit(types.START_UPLOAD);
        return api.chooseImg().then(localId => {
            commit(types.SET_LOCAL_ID, localId);
            return localId;
        }).then(api.wxUploadImg).then(serverId => {
            commit(types.SET_SERVER_ID, serverId);
            return serverId;
        }).then(api.uploadImg).then(() => {
            commit(types.UPLOAD_SUCCESS);
        }).catch(e => {
            commit(types.UPLOAD_FAIL);
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
    [types.START_UPLOAD] (state) {
        state.uploading = true;
    },
    [types.UPLOAD_SUCCESS] (state) {
        state.uploading = false;
        state.uploaded = true;
    },
    [types.UPLOAD_FAIL] (state) {
        state.uploading = false;
    },
    [types.START_SAVE] (state) {
        state.saving = true;
    },
    [types.SAVE_SUCCESS] (state) {
        state.saving = false;
    },
    [types.SAVE_FAIL] (state) {
        state.saving = false;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
