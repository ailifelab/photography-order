package com.ailifelab.photograph.entity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    /**
     * 员工标识
     */
    private Long id;
    /**
     * 账号
     */
    private String account;
    /**
     * 密码
     */
    private String password;
    private String passwordCheck;
    private String passwordNew;
    /**
     * token
     */
    private String token;
    /**
     * 花名
     */
    private String nickname;
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
     * 性别
     */
    private String gender;

    private Integer notifyCount = 0;
    private Integer unreadCount = 0;

    private Integer userStatus;
    private Integer pageSize;

    private Integer pageNum;
}
