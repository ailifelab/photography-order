package com.ailifelab.photograph.entity.po;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatisticsViewMonComboIncome {
    //套餐名称
    private String comboName;
    // 套餐编码
    private String comboId;
    // 月度套餐数量占比情况
    private Integer num;
    // 月度套餐金额占比情况
    private Double price;
}
