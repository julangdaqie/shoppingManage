const getters = {
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.auth.token,
    avatar: state => state.auth.avatar,
    name: state => state.auth.name,
    introduction: state => state.auth.introduction,
    roleId: state => state.auth.roleId,
    permission_routes: state => state.permission.routes,
}
export default getters
