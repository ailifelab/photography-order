package com.ailifelab.photograph.entity.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 员工信息
 */
@Getter
@Setter
/*@Entity
@Table(name = "stuff_account",schema = "photo_order")*/
public class StuffAccount {
    /**
     * 员工标识
     */
    /*@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)*/
    @TableId(type = IdType.AUTO)
    private Long id;
    /**
     * 账号
     */
//    @Column(name = "account", nullable = false, length = 36)
    private String account;
    /**
     * 密码
     */
//    @Column(name = "password", nullable = false)
    private String password;

    //    @Column(name = "salt", nullable = false)
    private String salt;
    /**
     * 花名
     */
//    @Column(name = "nickname", nullable = false, length = 20)
    private String nickname;
    /**
     * 姓名
     */
//    @Column(name = "name", length = 20)
    private String name;
    /**
     * 性别
     */
//    @Column(name = "gender", length = 6)
    private String gender;
    /**
     * 手机号
     */
//    @Column(name = "msisdn", length = 30)
    private String msisdn;
    /**
     * 身份识别码
     */
//    @Column(name = "identification", length = 18)
    private String identification;
    /**
     * 删除标识
     */
//    @Column(name = "user_status")
    private Integer userStatus;
    /**
     * email
     */
    private String email;
    /**
     * 头像
     */
    private String avatar;
    /**
     * access:admin/normal
     */
    private String access;
    /**
     * 创建日期
     */
//    @Column(name = "create_time")
    private Date createTime;
}
