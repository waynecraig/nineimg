import * as types from './mutation-types'
import api from '../api'

export const saveImg  = ({ commit }, options) => {
    return api.saveImg(options).then(post => {
        commit(types.RECEIVE_POSTS, [post]);
        return post._id;
    });
}

export const fetchPosts = ({ commit }, options) => {
    return api.queryPost(options).then(({posts, users}) => {
        commit(types.RECEIVE_POSTS, posts)
        commit(types.RECEIVE_USERS, users)
    })
}

