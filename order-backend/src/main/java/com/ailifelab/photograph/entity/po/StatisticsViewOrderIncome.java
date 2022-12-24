package com.ailifelab.photograph.entity.po;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatisticsViewOrderIncome {
    //历史订单总金额
    private Double hisTotalPrice;
    //历史订单总收入
    private Double hisIncome;
    //历史订单总支出
    private Double hisExpenditure;
    //历史订单毛利润
    private Double hisGrossProfit;
    //年度订单总金额
    private Double yearTotalPrice;
    //年度订单总收入
    private Double yearIncome;
    //年度订单总支出
    private Double yearExpenditure;
    //年度订单毛利润
    private Double yearGrossProfit;
    //季度订单总金额
    private Double quarterTotalPrice;
    //季度订单总收入
    private Double quarterIncome;
    //季度订单总支出
    private Double quarterExpenditure;
    //季度订单毛利润
    private Double quarterGrossProfit;
    //月度订单总金额
    private Double monTotalPrice;
    //月度订单总收入
    private Double monIncome;
    //月度订单总支出
    private Double monExpenditure;
    //月度订单毛利润
    private Double monGrossProfit;
    //月度订单毛利润同比
    private Double yearOnYearGrossProfit;
    //月度订单毛利润环比
    private Double monOnMonGrossProfit;
    //待收款
    private Double sumBalanceToPay;
}
