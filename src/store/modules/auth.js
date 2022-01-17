import {AuthApi} from "@/api/auth";
import {getToken, setToken, removeToken} from '@/utils/auth'

const state = {
    token: getToken(),
    name: '',
    roleName: '',
    avatar: '',
    introduction: '',
    roleId: ''
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_ROLE_NAME: (state, name) => {
        state.roleName = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLE_ID: (state, roleId) => {
        state.roleId = roleId
    }
}

const actions = {
    // user login
    login({commit}, userInfo) {
        const {userName, password} = userInfo
        return new Promise((resolve, reject) => {
            AuthApi.login({userName: userName.trim(), password: password}).then(res => {
                const {data} = res
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getUserInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            AuthApi.getUserInfo().then(res => {
                const {data} = res
                if (!data) {
                    reject('Verification failed, please Login again.')
                }
                const {role, userName, roleId} = data
                commit('SET_ROLE_ID', roleId)
                commit('SET_NAME', userName)
                commit('SET_ROLE_NAME', role.roleName)
                resolve(role)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({commit, dispatch}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLE_ID', '')
            removeToken()
            // resetRouter()
            // dispatch('tagsView/delAllViews', null, {root: true})
            resolve()
        })
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLE_ID', '')
            removeToken()
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
