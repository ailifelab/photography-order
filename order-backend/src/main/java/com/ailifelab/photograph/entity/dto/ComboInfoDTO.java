package com.ailifelab.photograph.entity.dto;

import com.ailifelab.photograph.entity.po.AppointmentInfo;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

/**
 * 套餐信息表
 */
@Getter
@Setter
public class ComboInfoDTO {
    //套餐编码
    @TableId
    private Long id;
    //套餐名称
    private String name;
    //套餐价格
    private Double price;
    //套餐描述
    private String desc;
    //包含套数
    private Integer numSet;
    //创建日期
    private Date createTime;

    private Integer pageSize;

    private Integer pageNum;

}
