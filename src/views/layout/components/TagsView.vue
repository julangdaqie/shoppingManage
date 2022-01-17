<template>
    <div id="tags-view-container" class="tags-view-container">
        <el-scrollbar class="tags-view-wrapper">
            <router-link
                    v-for="tag in visitedViews"
                    :ref="handleTagNodes"
                    :key="tag.path"
                    :class="isActive(tag)?'active':''"
                    :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                    tag="span"
                    class="tags-view-item"
            >
                {{ tag.title }}
                <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
            </router-link>
        </el-scrollbar>
    </div>
</template>

<script>
    import {
        computed,
        defineComponent,
        reactive,
        ref,
        toRefs,
        watch,
        nextTick,
        onBeforeUpdate,
        onMounted,
    } from "vue";
    import {useRouter, useRoute} from 'vue-router';
    import {useStore} from 'vuex'
    import path from 'path'

    export default defineComponent({
        name: "TagsView",
        setup() {
            const router = useRouter();
            const route = useRoute();
            const store = useStore();
            let tagNodes = ref([]);
            const handleTagNodes = function (el) {
                if (!tagNodes.value.includes(el)) {
                    tagNodes.value.push(el)
                }
            };
            const routes = computed(() => {
                return store.state.permission.routes
            });
            const state = reactive({
                affixTags: [],
                routes,
            });
            const visitedViews = computed(() => {
                return store.state.tagsView.visitedViews
            });
            const isActive = function (rt) {
                return rt.path === route.path
            };
            const isAffix = function (tag) {
                return tag.meta && tag.meta.affix
            };
            const filterAffixTags = function (routes, basePath = '/') {
                let tags = []
                routes.forEach(route => {
                    if (route.meta && route.meta.affix) {
                        const tagPath = path.resolve(basePath, route.path)
                        tags.push({
                            fullPath: tagPath,
                            path: tagPath,
                            name: route.name,
                            meta: {...route.meta}
                        })
                    }
                    if (route.children) {
                        const tempTags = filterAffixTags(route.children, route.path)
                        if (tempTags.length >= 1) {
                            tags = [...tags, ...tempTags]
                        }
                    }
                });
                return tags
            };
            const initTags = function () {
                const affixTags = state.affixTags = filterAffixTags(state.routes)
                for (const tag of affixTags) {
                    // Must have tag name
                    if (tag.name) {
                        store.dispatch('tagsView/addVisitedView', tag)
                    }
                }
            };

            const toLastView = function (visitedViews, view) {
                const latestView = visitedViews.slice(-1)[0];
                if (latestView) {
                    router.push(latestView.fullPath)
                } else {
                    // now the default is to redirect to the home page if there is no tags-view,
                    // you can adjust it according to your needs.
                    if (view.name === 'Dashboard') {
                        // to reload home page
                        router.replace({path: '/redirect' + view.fullPath})
                    } else {
                        router.push('/')
                    }
                }
            };
            const closeSelectedTag = function (view) {
                store.dispatch('tagsView/delView', view).then(({visitedViews}) => {
                    if (isActive(view)) {
                        toLastView(visitedViews, view)
                    }
                })
            };

            const addTags = function () {
                const {name} = route;
                if (name) {
                    store.dispatch('tagsView/addView', route)
                }
                return false
            };
            const moveToCurrentTag = function () {
                const tags = tagNodes.value;
                nextTick(() => {
                    for (const tag of tags) {
                        if (tag && tag.to.path === route.path) {
                            // when query is different then update
                            if (tag.to.fullPath !== route.fullPath) {
                                store.dispatch('tagsView/updateVisitedView', route)
                            }
                            break
                        }
                    }
                })
            };
            watch(() => route.path, (newValue) => {
                if(newValue === '/login'){
                    return
                }
                addTags();
                moveToCurrentTag()
            });
            onBeforeUpdate(() => {
                tagNodes.value = [];
            });

            onMounted(() => {
                initTags();
                addTags();
            });

            return {
                ...toRefs(state),
                visitedViews,
                isActive,
                isAffix,
                handleTagNodes,
                closeSelectedTag
            }
        }
    });
</script>
<style scoped lang="scss">
    .tags-view-container {
        height: 34px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

        .tags-view-wrapper {
            white-space: nowrap;
            .tags-view-item {
                display: inline-block;
                position: relative;
                cursor: pointer;
                height: 26px;
                line-height: 26px;
                border: 1px solid #d8dce5;
                color: #495060;
                background: #fff;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;

                &:first-of-type {
                    margin-left: 15px;
                }

                &:last-of-type {
                    margin-right: 15px;
                }

                &.active {
                    background-color: #42b983;
                    color: #fff;
                    border-color: #42b983;

                    &::before {
                        content: '';
                        background: #fff;
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: relative;
                        margin-right: 2px;
                    }
                }
            }
        }

        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 3000;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;

                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>

<style lang="scss">
    //reset element css of el-icon-close
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;

                &:before {
                    transform: scale(.6);
                    display: inline-block;
                    vertical-align: -3px;
                }

                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
</style>
