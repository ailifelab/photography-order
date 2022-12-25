// @ts-ignore
/* eslint-disable */
// import { request } from '@umijs/max';
import request from '@/api/request.js';
// import request from 'umi-request';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
    return request<{
        code: number;
        msg: string;
        data: API.CurrentUser;
    }>('/api/user/currentUser', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/user/signout', {
        method: 'POST',
        ...(options || {}),
    });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
    return request<API.LoginResult>('/api/user/doLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 获取员工列表 */
export async function listStuff(body: any) {
    return request<API.ResultData>('/api/user/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
/** 更新员工信息 */
export async function updateStuff(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/user/edit', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}
/** 修改密码 */
export async function editPwd(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/user/editPwd', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 新增员工 */
export async function addStuff(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/user/new', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 删除员工 */
export async function removeStuff(body: Array<String>, options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/user/delete', {
        method: 'DELETE',
        data: body,
        ...(options || {}),
    });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
    return request<API.NoticeIconList>('/api/notices', {
        method: 'GET',
        ...(options || {}),
    });
}

// export async function rule(
//     params: {
//         // query
//         /** 当前的页码 */
//         current?: number;
//         /** 页面的容量 */
//         pageSize?: number;
//     },
//     options?: { [key: string]: any },
// ) {
//     return requests<API.RuleList>('/api/orders/list', {
//         method: 'GET',
//         params: {
//             ...params,
//         },
//         ...(options || {}),
//     });
// }

/** 获取订单列表 */
export async function queryOrderList(body: any) {
    return request<API.ResultData>('/api/orders/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
/** 订单明细 */
export async function queryOrderDetail(orderNum: string) {
    return request<API.ResultData>('/api/orders/details/' + orderNum, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
/** 更新订单信息 */
export async function updateOrders(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/orders/edit', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 新增订单 */
export async function addOrder(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/orders/new', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 删除订单 */
export async function removeOrder(body: Array<string | number>, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/orders/suspend', {
        method: 'DELETE',
        data: body,
        ...(options || {}),
    });
}
/** 获取日历订单 */
export async function getCalendarData(body: any) {
    return request<API.ResultData>('/api/orders/calendar', {
        method: 'POST',
        data: body
    });

}
/** 检查日期 */
export async function checkCalendarData(body: API.OrderItem) {
    return request<API.ResultData>('/api/orders/calendar/check', {
        method: 'POST',
        data: body
    });
}
/** 获取会员列表 */
export async function listMembers(body: any) {
    return request<API.ResultData>('/api/members/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
/** 获取会员列表 */
export async function selectMembers(body: any) {
    return request<API.ResultData>('/api/members/selectList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
/** 更新会员信息 */
export async function updateMember(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/members/edit', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 新增会员 */
export async function addMember(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/members/new', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 删除会员 */
export async function removeMember(body: Array<String>) {
    return request<API.ResultData>('/api/members/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body
    });
}

/** 会员明细 */
export async function showMember(memberId: any) {
    return request<API.ResultData>('/api/members/details/' + memberId, {
        method: 'GET',
    });
}

/** 获取套餐列表 */
export async function listCombo(body: any) {
    return request<API.ResultData>('/api/combo/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
export async function selectCombos(body: any) {
    return request<API.ResultData>('/api/combo/selectList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
/** 更新套餐信息 */
export async function updateCombo(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/combo/edit', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 新增套餐 */
export async function addCombo(body: any, options?: { [key: string]: any }) {
    return request<API.ResultData>('/api/combo/new', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 删除套餐 */
export async function removeCombo(body: Array<String>, options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/combo/delete', {
        method: 'DELETE',
        data: body,
        ...(options || {}),
    });
}

/** 获取首页统计信息-订单统计 */
export async function sumOrders() {
    return request<{
        code: number;
        msg: string;
        data: API.StatisticsViewOrderIncome;
    }>('/api/statistics/order', {
        method: 'GET',
    });
}

/** 获取首页统计信息-套餐统计 */
export async function sumCombo() {
    return request<{
        code: number;
        msg: string;
        data: API.StatisticsViewMonComboIncome[];
    }>('/api/statistics/combo', {
        method: 'GET',
    });
}