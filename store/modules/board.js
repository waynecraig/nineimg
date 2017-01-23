import * as types from '../mutation-types'
import api from '../../api'

// initial state
const state = {
    localId: '',
    serverId: '',
    uploaded: false,
    uploading: false,
    saving: false,
    handling: false,
    adjusting: false
}

// getters
const getters = {
    canSave: state => state.uploaded && !state.handling && !state.adjusting
}

// actions
const actions = {
    uploadImg ({commit, state}) {
        return api.chooseImg().then(localId => {
            commit(types.SET_LOCAL_ID, localId);
            commit(types.START_UPLOAD);
            return localId;
        }).then(api.wxUploadImg).then(serverId => {
            if (!state.uploading) return Promise.reject();
            commit(types.SET_SERVER_ID, serverId);
            return serverId;
        }).then(api.uploadImg).then(() => {
            commit(types.UPLOAD_SUCCESS);
        }).catch(e => {
            commit(types.UPLOAD_FAIL);
        });
    },
    setInvalidImg ({commit}) {
        commit(types.SET_INVALID_IMG);
    },
    startHandle ({commit}) {
        commit(types.START_HANDLE);
    },
    stopHandle ({commit}) {
        commit(types.STOP_HANDLE);
    },
    startAdjust ({commit}) {
        commit(types.START_ADJUST);
    },
    stopAdjust ({commit}) {
        commit(types.STOP_ADJUST);
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
    },
    [types.SET_INVALID_IMG] (state) {
        state.localId = '';
        state.serverId = '';
        state.uploaded = false;
        state.uploading = false;
        state.saving = false;
    },
    [types.START_HANDLE] (state) {
        state.handling = true;
    },
    [types.STOP_HANDLE] (state) {
        state.handling = false;
    },
    [types.START_ADJUST] (state) {
        state.adjusting = true;
    },
    [types.STOP_ADJUST] (state) {
        state.adjusting = false;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
