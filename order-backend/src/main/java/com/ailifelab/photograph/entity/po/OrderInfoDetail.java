package com.ailifelab.photograph.entity.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class OrderInfoDetail {
    //编号
    @TableId(type = IdType.AUTO)
    private Long id;
    //订单编号
    private String orderNum;
    //套餐编码
    private Long comboId;
    //套餐价格
    private Double price;
    //优惠金额
    private Double offPrice;
    //数量
    private Integer amount;
    //创建日期
    private Date createTime;

}
