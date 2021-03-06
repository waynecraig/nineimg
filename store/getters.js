export const albumData = (state) => {
    return state.posts.all.filter(d=>d.userId === state.users.cur).map(d=>{
        return Object.assign({}, d, {
            exposed: state.posts.expose[d._id]
        });
    });
}

export const albumMaxTime = (state, getters) => {
    const a = getters.albumData;
    return a.length ? a[a.length-1].createTime : undefined;
}

export const listData = (state) => {
    return state.posts.all.map(d=>{
        const info = state.users.infos[d.userId];
        return Object.assign({}, d, {
            nickname: info && info.nickname,
            headimgurl: info && info.headimgurl,
            exposed: state.posts.expose[d._id]
        })
    })
}

