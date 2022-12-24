package com.ailifelab.photograph.controller;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.ComboInfoDTO;
import com.ailifelab.photograph.entity.po.ComboInfo;
import com.ailifelab.photograph.service.ComboService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 套餐信息
 */
@RestController
@RequestMapping("/combo")
public class ComboController {
    @Resource
    private ComboService comboService;

    /**
     * 新增
     */
    @PostMapping("new")
    public ResultData<ComboInfo> addCombo(@RequestBody ComboInfo comboInfo) {
        return this.comboService.addCombo(comboInfo);
    }

    /**
     * 删除
     */
    @DeleteMapping("delete")
    public ResultData<Page<ComboInfo>> deleteCombo(@RequestBody List<Long> comboIds) {
        return this.comboService.deleteCombo(comboIds);
    }

    /**
     * 修改
     */
    @PostMapping("edit")
    public ResultData<ComboInfo> editCombo(@RequestBody ComboInfo comboInfo) {
        return this.comboService.editCombo(comboInfo);
    }

    /**
     * 查询明细
     */
    @GetMapping("details/{comboId}")
    public ResultData<ComboInfo> details(@PathVariable("comboId") Long comboId) {
        return this.comboService.details(comboId);
    }

    /**
     * 查询列表
     */
    @PostMapping("list")
    public ResultData<Page<ComboInfo>> list(@RequestBody ComboInfoDTO comboInfo) {
        return this.comboService.list(comboInfo);
    }

    @PostMapping("selectList")
    public ResultData<List<ComboInfo>> selectList(@RequestBody ComboInfoDTO comboInfo) {
        return this.comboService.selectMembers(comboInfo);
    }
}
