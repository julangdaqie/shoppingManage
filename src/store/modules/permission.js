import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    routes.forEach(item => {
        item.newChildren = []
    })
    roles.auths.forEach(item => {
        let temp = item.url.split('/').splice(1, item.url.split('/').length)
        routes.forEach((item2, index) => {
            if (item2.name.toLowerCase() == temp[0].toLowerCase()) {
                item2.children.find((item3 => {
                    if (item3.name.toLowerCase() == temp[1].toLowerCase()) {
                        routes[index].newChildren.unshift(item3)
                    }
                }))
            }
        })
    })
    for (let i = routes.length - 1; i > -1; i--) {
        if (routes[i].newChildren.length == 0) {
            routes.splice(i, 1)
        }
    }
    routes.forEach(item => {
        item.children = item.newChildren
        delete item.newChildren
    })
    return routes
}

const state = {
    routes: [],
    addRoutes: [],
}

const mutations = {
    setPermissionList: (state, data) => {
        state.permissionList = data
    },
    SET_ROUTES(state, routes) {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
}

const actions = {
    generateRoutes({ state, commit }, role) {
        return new Promise((resolve) => {
            let accessedRoutes
            if (role.roleName === 'admin') {
                accessedRoutes = asyncRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, role)
            }
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
