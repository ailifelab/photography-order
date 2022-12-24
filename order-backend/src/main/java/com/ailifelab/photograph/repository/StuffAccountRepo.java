package com.ailifelab.photograph.repository;

import com.ailifelab.photograph.entity.po.StuffAccount;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Repository
public interface StuffAccountRepo extends BaseMapper<StuffAccount> {
    @Select("SELECT * FROM photo_order.stuff_account WHERE account=#{account}")
//    @Select("SELECT * FROM stuff_account WHERE account=#{account}")
    StuffAccount getByAccount(@Param("account") String account);

}
