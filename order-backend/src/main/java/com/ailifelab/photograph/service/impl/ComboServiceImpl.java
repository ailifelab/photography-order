package com.ailifelab.photograph.service.impl;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.ComboInfoDTO;
import com.ailifelab.photograph.entity.po.ComboInfo;
import com.ailifelab.photograph.repository.ComboInfoRepo;
import com.ailifelab.photograph.service.ComboService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class ComboServiceImpl implements ComboService {
    @Resource
    private ComboInfoRepo comboInfoRepo;

    @Override
    public ResultData<ComboInfo> addCombo(ComboInfo comboInfo) {
        comboInfo.setCreateTime(new Date());
        comboInfo.setId(null);
        this.comboInfoRepo.insert(comboInfo);
        return ResultData.success(this.comboInfoRepo.selectById(comboInfo.getId()));
    }

    @Override
    public ResultData<Page<ComboInfo>> deleteCombo(List<Long> comboIds) {
        this.comboInfoRepo.deleteBatchIds(comboIds);
        LambdaQueryWrapper<ComboInfo> wrapper = new LambdaQueryWrapper<ComboInfo>()
                .ne(ComboInfo::getDeleteTag, 1);
        Page<ComboInfo> results = this.comboInfoRepo.selectPage(new Page<>(1, 10), wrapper);
        return ResultData.success(results);
    }

    @Override
    public ResultData<ComboInfo> editCombo(ComboInfo comboInfo) {
        Long comboId = comboInfo.getId();
        if (comboId == null) {
            return ResultData.fail("请指定套餐编码！");
        }
        ComboInfo oldInfo = this.comboInfoRepo.selectById(comboId);
        if (oldInfo == null) {
            return ResultData.fail("套餐不存在！");
        }
        this.comboInfoRepo.updateById(comboInfo);
        oldInfo = this.comboInfoRepo.selectById(comboId);
        return ResultData.success(oldInfo);
    }

    @Override
    public ResultData<ComboInfo> details(Long comboId) {
        ComboInfo comboInfo = this.comboInfoRepo.selectById(comboId);
        return ResultData.success(comboInfo);
    }

    @Override
    public ResultData<Page<ComboInfo>> list(ComboInfoDTO comboInfo) {
        LambdaQueryWrapper<ComboInfo> wrapper = new LambdaQueryWrapper<ComboInfo>()
                .like(StringUtils.isNotBlank(comboInfo.getName()), ComboInfo::getName, comboInfo.getName())
                .ne(ComboInfo::getDeleteTag, 1);
        Integer pageNum = comboInfo.getPageNum();
        Integer pageSize = comboInfo.getPageSize();
        if (pageNum == null) {
            pageNum = 1;
        }
        if (pageSize == null) {
            pageSize = 10;
        }
        Page<ComboInfo> results = this.comboInfoRepo.selectPage(new Page<>(pageNum, pageSize), wrapper);
        return ResultData.success(results);
    }

    @Override
    public ResultData<List<ComboInfo>> selectMembers(ComboInfoDTO comboInfo) {
        LambdaQueryWrapper<ComboInfo> wrapper = new LambdaQueryWrapper<ComboInfo>()
                .like(StringUtils.isNotBlank(comboInfo.getName()), ComboInfo::getName, comboInfo.getName())
                .ne(ComboInfo::getDeleteTag, 1);
        List<ComboInfo> results = this.comboInfoRepo.selectList(wrapper);
        return ResultData.success(results);
    }

    @Override
    public ComboInfo getComboById(Long comboId) {
        //Todo 加缓存
        return this.comboInfoRepo.selectById(comboId);
    }
}
