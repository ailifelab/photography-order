package com.ailifelab.photograph.service.impl;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.MemberInfoDTO;
import com.ailifelab.photograph.entity.po.MemberInfo;
import com.ailifelab.photograph.repository.MemberInfoRepo;
import com.ailifelab.photograph.service.MemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MemberServiceImpl implements MemberService {
    @Resource
    private MemberInfoRepo memberInfoRepo;

    @Override
    public ResultData<Page<MemberInfo>> list(MemberInfoDTO memberInfo) {
        LambdaQueryWrapper<MemberInfo> wrapper = new LambdaQueryWrapper<MemberInfo>()
                .like(StringUtils.isNotBlank(memberInfo.getNickname()), MemberInfo::getNickname, memberInfo.getNickname())
                .ne(MemberInfo::getDeleteTag, 1)
                .orderByDesc(MemberInfo::getRegisterDate);
        Integer pageNum = memberInfo.getPageNum();
        Integer pageSize = memberInfo.getPageSize();
        if (pageNum == null) {
            pageNum = 1;
        }
        if (pageSize == null) {
            pageSize = 10;
        }
        Page<MemberInfo> results = this.memberInfoRepo.selectPage(new Page<>(pageNum, pageSize), wrapper);
        return ResultData.success(results);
    }

    @Override
    public ResultData<MemberInfo> newMember(MemberInfo memberInfo) {
        Date createTime = new Date();
        memberInfo.setRegisterDate(createTime);
        this.memberInfoRepo.insert(memberInfo);
        return ResultData.success(memberInfo);
    }

    @Override
    public ResultData<List<MemberInfo>> deleteMembers(List<Long> memberIds) {
        this.memberInfoRepo.deleteBatchIds(memberIds);
        return ResultData.success(new ArrayList<>());
    }

    @Override
    public ResultData<MemberInfo> editMember(MemberInfo memberInfo) {
        Long memberId = memberInfo.getMemberId();
        if (memberId == null) {
            return ResultData.fail("请指定会员编码！");
        }
        MemberInfo oldInfo = this.memberInfoRepo.selectById(memberId);
        if (oldInfo == null) {
            return ResultData.fail("会员不存在！");
        }
        this.memberInfoRepo.updateById(memberInfo);
        oldInfo = this.memberInfoRepo.selectById(memberId);
        return ResultData.success(oldInfo);
    }

    @Override
    public ResultData<MemberInfo> details(Long memberId) {
        MemberInfo memberInfo = this.memberInfoRepo.selectById(memberId);
        return memberInfo == null ? ResultData.fail("查无记录！") : ResultData.success(memberInfo);
    }

    @Override
    public ResultData<List<MemberInfo>> selectMembers(MemberInfoDTO memberInfo) {
        LambdaQueryWrapper<MemberInfo> wrapper = new LambdaQueryWrapper<MemberInfo>()
                .like(StringUtils.isNotBlank(memberInfo.getNickname()), MemberInfo::getNickname, memberInfo.getNickname())
                .ne(MemberInfo::getDeleteTag, 1)
                .orderByDesc(MemberInfo::getRegisterDate);
        if(StringUtils.isBlank(memberInfo.getNickname())){
            wrapper.last(" limit 10");
        }
        List<MemberInfo> results = this.memberInfoRepo.selectList(wrapper);
        return ResultData.success(results);
    }
}
