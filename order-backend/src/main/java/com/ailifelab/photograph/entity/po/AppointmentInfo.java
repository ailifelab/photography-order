package com.ailifelab.photograph.entity.po;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AppointmentInfo {
    @TableId
    private Long id;
    /**
     * 归属订单编码
     */
    private String orderNum;
    //套餐编码
    private Long comboId;
    /**
     * 归属订单明细id
     */
    private Long orderInfoDetailId;
    /**
     * 返图标记：0未拍摄，1已拍摄，2.已返原图，3.已返精修
     */
    private Integer picTag;
    /**
     * 本地图片路径备注
     */
    private String picUrl;
    /**
     * 预约拍照时间
     */
    private Date appointmentTime;
    /**
     * 数据更新时间
     */
    private Date updateTime;
}
