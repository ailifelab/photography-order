package com.ailifelab.photograph.entity.po;

import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
/*@Entity
@Table(name = "order_info",schema = "photo_order")*/
public class OrderInfo {
    /**
     * 订单编号（系统生成唯一号ord#{yyyyMMddHHmmssSSS}xxx）
     */
    /*@Id
    @Column(name = "order_num", unique = true)*/
    @TableId
    private String orderNum;
    /**
     * 预定时间（系统生成当前时间）
     */
    /*@Column(name = "order_time")*/
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date orderTime;
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
    /**
     * 预定人手机号
     */
    /*@Column(name = "msisdn", length = 30)*/
    private String msisdn;
    /**
     * 预定人微信号
     */
    /*@Column(name = "wechat", length = 30)*/
    private String wechat;
    /**
     * 预定人QQ号
     */
    /*@Column(name = "qq_number", length = 30)*/
    private String qqNumber;
    /**
     * 小红书账号
     */
    /*@Column(name = "xiao_hong_shu", length = 30)*/
    private String xiaoHongShu;
    /**
     * 预定人邮箱地址
     */
    /*@Column(name = "email", length = 100)*/
    private String email;
    /**
     * 预定人性别
     */
    /*@Column(name = "gender", length = 6)*/
    private String gender;
    /**
     * 定金
     */
    /*@Column(name = "deposit")*/
    private Double deposit;
    /**
     * 应付尾款
     */
    /*@Column(name = "balance_to_pay")*/
    private Double balanceToPay;
    /**
     * 订单总额（定金+应付尾款）
     */
    /*@Column(name = "total_price")*/
    private Double totalPrice;
    /**
     * 预定套餐情况
     */
//    @Column(name = "package_remarks")
    private String packageRemarks;
    /**
     * 预约拍照时间（如果当日有订单，系统提示已预约了哪些）
     */
//    @Column(name = "appointment_time")
    private Date appointmentTime;
    /**
     * 预约主题备注（富文本）
     */
//    @Column(name = "topic_detail")
    private String topicDetail;
    /**
     * 已收尾款（默认应付尾款等值）
     */
//    @Column(name = "balance_payment")
    private Double balancePayment;
    /**
     * 尾款收入时间（默认填写已收尾款日期）
     */
//    @Column(name = "balance_payment_time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date balancePaymentTime;
    /**
     * 额外支出费用
     */
//    @Column(name = "expenditure")
    private Double expenditure;
    /**
     * 额外支出备注
     */
//    @Column(name = "expenditure_remarks")
    private String expenditureRemarks;
    /**
     * 合计收入(除去支出)
     */
//    @Column(name = "income")
    private Double income;
    /**
     * 办结标记
     */
    private Integer finishedTag;
    /**
     * 作废标记
     */
//    @Column(name = "delete_tag")
    private Integer deleteTag;
    /**
     * 作废时间
     */
//    @Column(name = "delete_time")
    private Date deleteTime;
    //上次操作时间 
    private Date lastUpdateTime;
    //上次操作人员
    private Long lastUpdateUser;

}
