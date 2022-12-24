package com.ailifelab.photograph.entity.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
/*@Entity
@Table(name = "member_info",schema = "photo_order")*/
public class MemberInfo {

    /**
     * 会员编号（系统生成）
     */
    /*@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)*/
    @TableId(type = IdType.AUTO)
    private Long memberId;

    /**
     * 预定人昵称/姓名（输入手机号或部分名称可选已订过单子的人）
     */
//    @Column(name = "nickname", nullable = false, length = 20)
    private String nickname;
    /**
     * 预定人手机号
     */
//    @Column(name = "msisdn", length = 30)
    private String msisdn;
    /**
     * 预定人微信号
     */
//    @Column(name = "wechat", length = 30)
    private String wechat;
    /**
     * 预定人QQ号
     */
//    @Column(name = "qq_number", length = 30)
    private String qqNumber;
    /**
     * 小红书账号
     */
//    @Column(name = "xiao_hong_shu", length = 30)
    private String xiaoHongShu;
    /**
     * 预定人邮箱地址
     */
//    @Column(name = "email", length = 100)
    private String email;
    /**
     * 姓名
     */
//    @Column(name = "name", length = 20)
    private String name;
    /**
     * 预定人性别
     */
//    @Column(name = "gender", length = 6)
    private String gender;
    /**
     * birthday
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date birthday;
    /**
     * 第一次预定时间
     */
//    @Column(name = "register_date")
    private Date registerDate;
    /**
     * 备注信息(偏好、风格)
     */
//    @Column(name = "remarks")
    private String remarks;
    /**
     * deleted:0not,1yes
     */
    private Integer deleteTag;
    //作废时间
    private Date deleteTime;

}
