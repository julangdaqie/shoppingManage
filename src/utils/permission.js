export function routerMatch(permission, asyncRouter) {
    return new Promise((resolve) => {
        const routers = [];
        // 创建路由
        function createRouter(permission) {
            // 根据路径匹配到的router对象添加到routers中即可
            permission.forEach((item) => {
                if (item.children && item.children.length) {
                    createRouter(item.children)
                }
                let path = item.path;
                // 循环异步路由，将符合权限列表的路由加入到routers中
                asyncRouter.find((s) => {
                    if (s.path === '') {
                        s.children.find((y) => {
                            if (y.path === path) {
                                y.meta.permission = item.permission;
                                routers.push(s);
                            }
                        })
                    }
                    if (s.path === path) {
                        s.meta.permission = item.permission;
                        routers.push(s);
                    }
                })
            })
        }

        createRouter(permission);
        resolve([routers])
    })
}