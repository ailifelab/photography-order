// @ts-ignore
/* eslint-disable */

declare namespace API {
    type CurrentUser = {
        id?: number;
        account?: string;
        token: string;
        nickname?: string;
        avatar?: string;
        email?: string;
        signature?: string;
        title?: string;
        group?: string;
        tags?: { key?: string; label?: string }[];
        notifyCount?: number;
        unreadCount?: number;
        gender?: string;
        access?: string;
        address?: string;
        msisdn?: string;
        userStatus?: number;
    };

    type LoginResult = {
        code?: number;
        msg?: string;
        data: CurrentUser
    };

    type PageParams = {
        pageNum?: number;
        pageSize?: number;
    };

    type ResultData = {
        code?: number;
        msg?: string;
        data?: any;
    }

    type ResultPage = {
        code?: number;
        msg?: string;
        data?: {
            records?: any;
            pages?: number;
            total?: number;
            current?: number;
        }
    }

    type OrderItem = {
        orderNum?: key;
        orderTime?: Date;
        nickname?: string;
        memberId?: number;
        msisdn?: string;
        wechat?: string;
        qqNumber?: string;
        xiaoHongShu?: string;
        email?: string;
        gender?: string;
        deposit: number;
        balanceToPay?: number;
        totalPrice: number;
        packageRemarks?: string;
        appointmentTime?: Date;
        topicDetail?: string;
        balancePayment?: number;
        balancePaymentTime?: Date;
        expenditure?: number;
        expenditureRemarks?: string;
        income?: number;
        deleteTag?: number;
        deleteTime?: Date;
        finishedTag?: number;
        comboList?: OrderInfoDetail[];
    }

    type MemberInfo = {
        memberId?: key;
        nickname?: string;
        msisdn?: string;
        wechat?: string;
        qqNumber?: string;
        xiaoHongShu?: string;
        email?: string;
        name?: string;
        gender?: string;
        birthday?: Date;
        registerDate?: Date;
        remarks?: string;
        label?: string;
        value?: string;
    }

    type ComboInfo = {
        id?: key;
        name?: string;
        //套餐价格
        price?: number;
        //套餐描述
        desc?: string;
        //包含套数
        numSet?: number;
        //创建日期
        createTime?: Date;
    }

    type StuffAccount = {
        id?: key;
        account?: string;
        password?: string;
        nickname?: string;
        name?: string;
        gender?: string;
        msisdn?: string;
        identification?: string;
        userStatus?: number;
        email?: string;
        avatar?: string;
        access?: string;
        createTime?: Date;
    }

    type DailyOrders = {
        date?: Date;
        week?: number;
        month?: string;
        orderInfoList?: OrderItem[]
    }

    type OrderInfoDetail = {
        id?: key;
        orderNum?: string;
        comboId?: number;
        price?: number;
        offPrice?: number;
        amount?: number;
        createTime?: Date;
        appointmentInfo?: AppointmentInfo[]
    }

    type AppointmentInfo = {
        id?: key;
        orderNum?: string;
        orderInfoDetailId?: number;
        picUrl?: string;
        picTag?: number;
        appointmentTime?: Date;
    }

    type StatisticsViewMonComboIncome = {
        comboName?: string;
        num?: number;
        price?: number;
    }

    type StatisticsViewOrderIncome = {
        //历史订单总金额
        hisTotalPrice?: number;
        //历史订单总收入
        hisIncome?: number;
        //历史订单总支出
        hisExpenditure?: number;
        //历史订单毛利润
        hisGrossProfit?: number;
        //年度订单总金额
        yearTotalPrice?: number;
        //年度订单总收入
        yearIncome?: number;
        //年度订单总支出
        yearExpenditure?: number;
        //年度订单毛利润
        yearGrossProfit?: number;
        //季度订单总金额
        quarterTotalPrice?: number;
        //季度订单总收入
        quarterIncome?: number;
        //季度订单总支出
        quarterExpenditure?: number;
        //季度订单毛利润
        quarterGrossProfit?: number;
        //月度订单总金额
        monTotalPrice?: number;
        //月度订单总收入
        monIncome?: number;
        //月度订单总支出
        monExpenditure?: number;
        //月度订单毛利润
        monGrossProfit?: number;
        //月度订单毛利润同比
        yearOnYearGrossProfit?: number;
        //月度订单毛利润环比
        monOnMonGrossProfit?: number;
        //待收款
        sumBalanceToPay?: number;
    }


    type FakeCaptcha = {
        code?: number;
        status?: string;
    };

    type LoginParams = {
        username?: string;
        password?: string;
        autoLogin?: boolean;
        type?: string;
    };

    type ErrorResponse = {
        /** 业务约定的错误码 */
        errorCode: string;
        /** 业务上的错误信息 */
        errorMessage?: string;
        /** 业务上的请求是否成功 */
        success?: boolean;
    };

    type NoticeIconList = {
        data?: NoticeIconItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type NoticeIconItemType = 'notification' | 'message' | 'event';

    type NoticeIconItem = {
        id?: string;
        extra?: string;
        key?: string;
        read?: boolean;
        avatar?: string;
        title?: string;
        status?: string;
        datetime?: string;
        description?: string;
        type?: NoticeIconItemType;
    };

    type RuleListItem = {
        key?: number;
        disabled?: boolean;
        href?: string;
        avatar?: string;
        name?: string;
        owner?: string;
        desc?: string;
        callNo?: number;
        status?: number;
        updatedAt?: string;
        createdAt?: string;
        progress?: number;
    };
}
