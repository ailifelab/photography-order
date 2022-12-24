package com.ailifelab.photograph.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.UserDTO;
import com.ailifelab.photograph.entity.po.StuffAccount;
import com.ailifelab.photograph.repository.StuffAccountRepo;
import com.ailifelab.photograph.service.UserService;
import com.ailifelab.photograph.utils.PasswdUtils;
import com.ailifelab.photograph.utils.SessionUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    private StuffAccountRepo stuffAccountRepo;

    @Override
    public StuffAccount getByAccount(String account) {
        return this.stuffAccountRepo.getByAccount(account);
    }

    @Override
    public UserDTO getById(Long id) {
        StuffAccount stuffAccount = this.stuffAccountRepo.selectById(id);
        UserDTO userDTO = new UserDTO();
        userDTO.setId(id);
        userDTO.setNickname(stuffAccount.getNickname());
        userDTO.setAccount(stuffAccount.getAccount());
        userDTO.setGender(stuffAccount.getGender());
        userDTO.setAccess(stuffAccount.getAccess());
        userDTO.setAvatar(stuffAccount.getAvatar());
        userDTO.setEmail(stuffAccount.getEmail());
        return userDTO;
    }

    @Override
    public ResultData<UserDTO> login(UserDTO loginUser) {
        StuffAccount user = this.getByAccount(loginUser.getAccount());
        if (user == null) {
            return ResultData.fail("该用户不存在！");
        }
        String encPwd = PasswdUtils.getMd5Pwd(loginUser.getPassword() + user.getSalt());
        if (user != null && user.getAccount().equals(loginUser.getAccount())
                && user.getPassword().equals(encPwd)) {
            if (1 == user.getUserStatus()) return ResultData.fail("该账户已被禁用!");
            StpUtil.login(user.getId());
            UserDTO userSession = new UserDTO();
            userSession.setAccount(user.getAccount());
            userSession.setId(user.getId());
            userSession.setAvatar(user.getAvatar());
            userSession.setAccess(user.getAccess());
            userSession.setEmail(user.getEmail());
            userSession.setGender(user.getGender());
            userSession.setNickname(user.getNickname());
            userSession.setUserStatus(user.getUserStatus());
            SessionUtils.initUser(userSession);
            userSession.setToken(StpUtil.getTokenValue());
            return ResultData.success(userSession);
        }
        return ResultData.fail("账号或密码错误！");
    }

    @Override
    public ResultData<UserDTO> currentUser() {
        try {
            UserDTO now = SessionUtils.getUser();
//            if (now == null) return ResultData.fail("您未登录!");
            /*UserDTO user = this.getById(now.getId());
            user.setToken(now.getToken());*/
            now.setUnreadCount(0);
            return ResultData.success(now);
        } catch (Exception e) {
            return ResultData.fail(e.getMessage());
        }
    }

    @Override
    public ResultData<Page<StuffAccount>> listUsers(UserDTO userDTO) {
        UserDTO loginUser = SessionUtils.getUser();
        String access = loginUser.getAccess();
        if (!"admin".equals(access)) {
            return ResultData.fail("无权限查看！");
        }
        LambdaQueryWrapper<StuffAccount> queryWrapper = new LambdaQueryWrapper<StuffAccount>()
                .select(StuffAccount::getId,
                        StuffAccount::getAccount,
                        StuffAccount::getAvatar,
                        StuffAccount::getNickname,
                        StuffAccount::getEmail,
                        StuffAccount::getName,
                        StuffAccount::getMsisdn,
                        StuffAccount::getGender,
                        StuffAccount::getIdentification,
                        StuffAccount::getAccess,
                        StuffAccount::getCreateTime)
                .ne(StuffAccount::getUserStatus, 1)
                .like(userDTO.getNickname() != null, StuffAccount::getNickname, userDTO.getNickname())
                .orderByDesc(StuffAccount::getId);
        Integer pageNum = userDTO.getPageNum();
        Integer pageSize = userDTO.getPageSize();
        if (pageNum == null) {
            pageNum = 1;
        }
        if (pageSize == null) {
            pageSize = 10;
        }
        Page<StuffAccount> accounts = this.stuffAccountRepo.selectPage(new Page<>(pageNum, pageSize), queryWrapper);
        return ResultData.success(accounts);
    }

    @Override
    public ResultData<UserDTO> newUser(UserDTO userDTO) {
        String salt = PasswdUtils.getRandomString(6);
        StuffAccount stuffAccount = new StuffAccount();
        BeanUtils.copyProperties(userDTO, stuffAccount);
        stuffAccount.setId(null);
        stuffAccount.setCreateTime(new Date());
        stuffAccount.setSalt(salt);
        stuffAccount.setPassword(PasswdUtils.getMd5Pwd(userDTO.getPassword() + salt));
        this.stuffAccountRepo.insert(stuffAccount);
        stuffAccount = this.stuffAccountRepo.selectById(stuffAccount.getId());
        UserDTO userInfo = new UserDTO();
        BeanUtils.copyProperties(stuffAccount, userInfo);
        return ResultData.success(userInfo);
    }

    @Override
    public ResultData<Page<StuffAccount>> deleteUsers(List<Long> userIds) {
        UserDTO loginUser = SessionUtils.getUser();
        String access = loginUser.getAccess();
        if (!"admin".equals(access)) {
            return ResultData.fail("无权限操作！");
        }
        List<Long> deleteIds = userIds.stream().filter(userId -> !userId.equals(loginUser.getId())).toList();
        for (Long deleteId : deleteIds) {
            StuffAccount stuffAccount = new StuffAccount();
            stuffAccount.setId(deleteId);
            stuffAccount.setUserStatus(1);
            this.stuffAccountRepo.updateById(stuffAccount);
        }
        return this.listUsers(new UserDTO());
    }

    @Override
    public ResultData<UserDTO> editUser(UserDTO userDTO) {
        UserDTO loginUser = SessionUtils.getUser();
        String access = loginUser.getAccess();
        if (!loginUser.getId().equals(userDTO.getId()) && !"admin".equals(access)) {
            return ResultData.fail("无权限操作！");
        }
        StuffAccount stuffAccount = new StuffAccount();
        BeanUtils.copyProperties(userDTO, stuffAccount);
        this.stuffAccountRepo.updateById(stuffAccount);
        stuffAccount = this.stuffAccountRepo.selectById(stuffAccount.getId());
        UserDTO result = new UserDTO();
        BeanUtils.copyProperties(stuffAccount, result);
        return ResultData.success(result);
    }

    @Override
    public ResultData<UserDTO> editPwd(UserDTO userDTO) {
        if (!userDTO.getPasswordNew().equals(userDTO.getPasswordCheck())) {
            return ResultData.fail("两次输入密码不同，请重新输入！");
        }
        UserDTO userInfo = SessionUtils.getUser();
        StuffAccount stuffAccount = this.stuffAccountRepo.selectById(userInfo.getId());
        String encPwd = PasswdUtils.getMd5Pwd(userDTO.getPassword() + stuffAccount.getSalt());
        if (!encPwd.equals(stuffAccount.getPassword())) {
            return ResultData.fail("用户密码输入错误，请重试！");
        }
        String salt = PasswdUtils.getRandomString(6);
        StuffAccount stuff = new StuffAccount();
        stuff.setId(userInfo.getId());
        stuff.setSalt(salt);
        stuff.setPassword(PasswdUtils.getMd5Pwd(userDTO.getPasswordNew() + salt));
        this.stuffAccountRepo.updateById(stuff);
        return ResultData.success(null, "密码修改成功！");
    }
}
