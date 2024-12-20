import { ForbiddenException } from '@nestjs/common';
import { envBoolean } from '~/global/env';
import { isExternal } from '~/utils/is.util';
import { uniqueSlash } from './tool.util';
function createRoute(menu, _isRoot) {
    const commonMeta = {
        title: menu.name,
        icon: menu.icon,
        isExt: menu.isExt,
        extOpenMode: menu.extOpenMode,
        type: menu.type,
        orderNo: menu.orderNo,
        show: menu.show,
        activeMenu: menu.activeMenu,
        status: menu.status,
        keepAlive: menu.keepAlive,
    };
    if (isExternal(menu.path)) {
        return {
            id: menu.id,
            path: menu.path,
            // component: 'IFrame',
            name: menu.name,
            meta: { ...commonMeta },
        };
    }
    // 目录
    if (menu.type === 0) {
        return {
            id: menu.id,
            path: menu.path,
            component: menu.component,
            name: menu.name,
            meta: { ...commonMeta },
        };
    }
    return {
        id: menu.id,
        path: menu.path,
        name: menu.name,
        component: menu.component,
        meta: {
            ...commonMeta,
        },
    };
}
function filterAsyncRoutes(menus, parentRoute) {
    const res = [];
    menus.forEach((menu) => {
        if (menu.type === 2 || !menu.status) {
            // 如果是权限或禁用直接跳过
            return;
        }
        // 根级别菜单渲染
        let realRoute;
        const genFullPath = (path, parentPath) => {
            return uniqueSlash(path.startsWith('/') ? path : `/${parentPath}/${path}`);
        };
        if (!parentRoute && !menu.parentId && menu.type === 1) {
            // 根菜单
            realRoute = createRoute(menu, true);
        }
        else if (!parentRoute && !menu.parentId && menu.type === 0) {
            // 目录
            const childRoutes = filterAsyncRoutes(menus, menu);
            realRoute = createRoute(menu, true);
            if (childRoutes && childRoutes.length > 0) {
                realRoute.redirect = genFullPath(childRoutes[0].path, realRoute.path);
                realRoute.children = childRoutes;
            }
        }
        else if (parentRoute
            && parentRoute.id === menu.parentId
            && menu.type === 1) {
            // 子菜单
            realRoute = createRoute(menu, false);
        }
        else if (parentRoute
            && parentRoute.id === menu.parentId
            && menu.type === 0) {
            // 如果还是目录，继续递归
            const childRoutes = filterAsyncRoutes(menus, menu);
            realRoute = createRoute(menu, false);
            if (childRoutes && childRoutes.length > 0) {
                realRoute.redirect = genFullPath(childRoutes[0].path, realRoute.path);
                realRoute.children = childRoutes;
            }
        }
        // add curent route
        if (realRoute)
            res.push(realRoute);
    });
    return res;
}
export function generatorRouters(menus) {
    return filterAsyncRoutes(menus, null);
}
// 获取所有菜单以及权限
function filterMenuToTable(menus, parentMenu) {
    const res = [];
    menus.forEach((menu) => {
        // 根级别菜单渲染
        let realMenu;
        if (!parentMenu && !menu.parentId && menu.type === 1) {
            // 根菜单，查找该跟菜单下子菜单，因为可能会包含权限
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        }
        else if (!parentMenu && !menu.parentId && menu.type === 0) {
            // 根目录
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        }
        else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 1) {
            // 子菜单下继续找是否有子菜单
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        }
        else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 0) {
            // 如果还是目录，继续递归
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        }
        else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 2) {
            realMenu = { ...menu };
        }
        // add curent route
        if (realMenu) {
            realMenu.pid = menu.id;
            res.push(realMenu);
        }
    });
    return res;
}
export function generatorMenu(menu) {
    return filterMenuToTable(menu, null);
}
/** 检测是否为演示环境, 如果为演示环境，则拒绝该操作 */
export function checkIsDemoMode() {
    if (envBoolean('IS_DEMO'))
        throw new ForbiddenException('演示模式下不允许操作');
}
//# sourceMappingURL=permission.util.js.map