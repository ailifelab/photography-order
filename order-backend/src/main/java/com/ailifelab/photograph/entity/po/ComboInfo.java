package com.ailifelab.photograph.entity.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 套餐信息表
 */
@Getter
@Setter
public class ComboInfo {
    //套餐编码
    @TableId(type = IdType.AUTO)
    private Long id;
    //套餐名称
    private String name;
    //套餐价格
    private Double price;
    //套餐描述
    private String remark;
    //包含套数
    private Integer numSet;
    //创建日期
    private Date createTime;
    //删除标识
    private Integer deleteTag;
    //作废时间
    private Date deleteTime;

}
