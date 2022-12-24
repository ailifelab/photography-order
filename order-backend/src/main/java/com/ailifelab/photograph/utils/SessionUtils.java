package com.ailifelab.photograph.utils;

import cn.dev33.satoken.session.SaSession;
import cn.dev33.satoken.stp.StpUtil;
import com.ailifelab.photograph.entity.dto.UserDTO;

public class SessionUtils {

    /**
     * 登录成功后初始化session;
     */
    public static void initUser(UserDTO user) {
        SaSession saSession = StpUtil.getSession(false);
        if (saSession == null) return;
        user.setPassword(null);
        saSession.set("currentUser", user);
//        saSession.setAttribute("currentUser", user);
    }

    /**
     * 从session中获取用户信息.
     */
    public static UserDTO getUser() {
        SaSession saSession = null;
        try {
            saSession = StpUtil.getSession(false);
        } catch (Exception e) {
            throw new RuntimeException("当前用户未登录！");
        }
        if (saSession == null) {
            throw new RuntimeException("当前用户未登录！");
        }
        UserDTO userDTO = (UserDTO) saSession.get("currentUser");
        userDTO.setToken(StpUtil.getTokenValue());
        return userDTO;
    }

    /**
     * 从session中获取用户信息.
     */
    /*public static Long getUserId(){
        try {
            SaSession saSession  = StpUtil.getSession(false);
            return ((SysUser) saSession.getAttribute("currentUser")).getId();
        }catch (Exception e){
            return null;
        }
    }*/
    public static String getRedisLogKey(Long userId, String className, String methodName) {
        return userId + "-" + className + "-" + methodName;
    }
}
