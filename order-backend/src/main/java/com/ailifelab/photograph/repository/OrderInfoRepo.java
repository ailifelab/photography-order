package com.ailifelab.photograph.repository;

import com.ailifelab.photograph.entity.po.OrderInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderInfoRepo extends BaseMapper<OrderInfo> {
    @Select("SELECT * FROM photo_order.order_info t1 " +
            "WHERE TO_CHAR(t1.appointment_time,'yyyy')=#{year} and TO_CHAR(t1.appointment_time,'mm')=#{month}")
    List<OrderInfo> selectMonth(@Param("year") String year, @Param("month") String month);
}
