package com.ailifelab.photograph.controller;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.MemberInfoDTO;
import com.ailifelab.photograph.entity.po.MemberInfo;
import com.ailifelab.photograph.service.MemberService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/members")
public class MemberController {
    @Resource
    private MemberService memberService;

    /**
     * 会员列表
     */
    @PostMapping("list")
    public ResultData<Page<MemberInfo>> list(@RequestBody MemberInfoDTO memberInfo) {
        return this.memberService.list(memberInfo);
    }


    @PostMapping("selectList")
    public ResultData<List<MemberInfo>> selectMembers(@RequestBody MemberInfoDTO memberInfo) {
        return this.memberService.selectMembers(memberInfo);
    }

    /**
     * 新增会员
     */
    @PostMapping("new")
    public ResultData<MemberInfo> newMember(@RequestBody MemberInfo memberInfo) {
        return this.memberService.newMember(memberInfo);
    }

    /**
     * 删除会员
     */
    @DeleteMapping("delete")
    public ResultData<List<MemberInfo>> deleteMembers(@RequestBody List<Long> memberIds) {
        return this.memberService.deleteMembers(memberIds);
    }

    /**
     * 修改会员信息
     */
    @PostMapping("edit")
    public ResultData<MemberInfo> editMember(@RequestBody MemberInfo memberInfo) {
        return this.memberService.editMember(memberInfo);
    }

    /**
     * 查询会员详细信息
     */
    @GetMapping("details/{memberId}")
    public ResultData<MemberInfo> details(@PathVariable("memberId") Long memberId) {
        return this.memberService.details(memberId);
    }
}
