package com.ailifelab.photograph.entity.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DailyAppointmentDTO {
    private Long id;
    /**
     * 归属订单编码
     */
    private String orderNum;
    //套餐编码
    private Long comboId;
    /**
     * 归属订单明细id
     */
    private Long orderInfoDetailId;
    /**
     * 返图标记：0未拍摄，1已拍摄，2.已返原图，3.已返精修
     */
    private Integer picTag;
    /**
     * 预约拍照时间
     */
    private Date appointmentTime;
    /**
     * 预定人昵称/姓名（输入手机号或部分名称可选已订过单子的人）
     */
    /*@Column(name = "nickname", nullable = false, length = 20)*/
    private String nickname;
    /**
     * 会员编号（系统生成）
     */
    /*@Column(name = "member_id")*/
    private Long memberId;
}
