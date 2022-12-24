package com.ailifelab.photograph.service;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.UserDTO;
import com.ailifelab.photograph.entity.po.MemberInfo;
import com.ailifelab.photograph.entity.po.StuffAccount;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

public interface UserService {
    StuffAccount getByAccount(String account);

    UserDTO getById(Long id);

    ResultData<UserDTO> login(UserDTO loginUser);

    ResultData<UserDTO> currentUser();

    ResultData<Page<StuffAccount>> listUsers(UserDTO userDTO);

    ResultData<UserDTO> newUser(UserDTO userDTO);

    ResultData<Page<StuffAccount>> deleteUsers(List<Long> userIds);

    ResultData<UserDTO> editUser(UserDTO userDTO);

    ResultData<UserDTO> editPwd(UserDTO userDTO);
}
