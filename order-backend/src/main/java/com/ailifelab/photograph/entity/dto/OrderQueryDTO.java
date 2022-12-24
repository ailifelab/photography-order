package com.ailifelab.photograph.entity.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class OrderQueryDTO {

    /**
     * 预定时间开始
     */
    private Date orderTimeStart;

    /**
     * 预定时间结束
     */
    private Date orderTimeEnd;

    private Integer pageSize;

    private Integer pageNum;
    /**
     * 预定人手机号
     */
    private Long msisdn;
    /**
     * 预定人昵称/姓名（输入手机号或部分名称可选已订过单子的人）
     */
    private String nickname;
    /**
     * 已完成尾款收讫
     */
    private Integer balancePayed;
    /**
     * 订单总额范围下界（定金+应付尾款）
     */
    private Double totalPriceLower;
    /**
     * 订单总额范围上界（定金+应付尾款）
     */
    private Double totalPriceUpper;

    /**
     * 办结标记
     */
    private Integer finishedTag;
    /**
     * 查询月份
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date watchMonth;
}
