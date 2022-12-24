package com.ailifelab.photograph.entity.dto;

import com.ailifelab.photograph.entity.po.AppointmentInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderInfoDetailDTO {

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
    private List<AppointmentInfo> appointmentInfo;
}
