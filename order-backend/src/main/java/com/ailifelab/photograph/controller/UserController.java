package com.ailifelab.photograph.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.UserDTO;
import com.ailifelab.photograph.entity.po.StuffAccount;
import com.ailifelab.photograph.service.UserService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/*@CrossOrigin(origins = {"http://localhost:9001",
        "http://localhost:8000"},
        allowedHeaders = "*",
        maxAge = 1800, allowCredentials = "true")*/
@RestController
@RequestMapping("/user")
public class UserController {
    @Resource
    private UserService userService;

    @PostMapping("doLogin")
    public ResultData<UserDTO> login(@RequestBody UserDTO loginUser) {
        return this.userService.login(loginUser);
    }

    @PostMapping("signout")
    public ResultData signOut() {
        StpUtil.logout();
        return ResultData.success("退出成功！");
    }

    @GetMapping("currentUser")
    public ResultData<UserDTO> currentUser() {
        return this.userService.currentUser();
    }

    @PostMapping("list")
    public ResultData<Page<StuffAccount>> listUsers(@RequestBody UserDTO userDTO) {
        return this.userService.listUsers(userDTO);
    }

    @PostMapping("editPwd")
    public ResultData<UserDTO> editPwd(@RequestBody UserDTO userDTO){
        return this.userService.editPwd(userDTO);
    }

    /**
     * 新增
     */
    @PostMapping("new")
    public ResultData<UserDTO> newUser(@RequestBody UserDTO userDTO) {
        return this.userService.newUser(userDTO);
    }

    /**
     * 删除
     */
    @DeleteMapping("delete")
    public ResultData<Page<StuffAccount>> deleteUsers(@RequestBody List<Long> userIds) {
        return this.userService.deleteUsers(userIds);
    }

    /**
     * 修改
     */
    @PostMapping("edit")
    public ResultData<UserDTO> editUser(@RequestBody UserDTO userDTO) {
        return this.userService.editUser(userDTO);
    }

}
