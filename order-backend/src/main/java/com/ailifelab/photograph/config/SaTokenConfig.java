package com.ailifelab.photograph.config;

import cn.dev33.satoken.context.SaHolder;
import cn.dev33.satoken.filter.SaServletFilter;
import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import com.ailifelab.photograph.entity.common.ResultData;
import com.alibaba.fastjson2.JSON;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    @Value("${whiteListConfig}")
    String whiteListConfig;

    List<String> whiteListConfigList = new ArrayList<>();

    @PostConstruct
    private void initWhiteListConfigList() {
        this.whiteListConfigList = Arrays.asList(whiteListConfig.split(","));
    }

    /**
     * 注册 [sa-token全局过滤器]
     */
    @Bean
    public SaServletFilter getSaServletFilter() {
        return new SaServletFilter()
                // 指定 拦截路由 与 放行路由
                .addInclude("/**")
                .addExclude("/favicon.ico")

                // 认证函数: 每次请求执行
                .setAuth(r -> {
                    // 登录验证 -- 拦截所有路由，并排除/user/doLogin 用于开放登录
                    SaRouter.match("/**").notMatch(whiteListConfigList).check(StpUtil::checkLogin);
//                    SaRouterUtil.match(Arrays.asList("/api/**"), whiteListConfigList, () -> StpUtil.checkLogin());
                })
                // 异常处理函数：每次认证函数发生异常时执行此函数
                .setError(e -> {
//                    SaHolder.getResponse().setStatus(HttpStatus.UNAUTHORIZED.value());
                    return JSON.toJSONString(ResultData.fail(HttpStatus.UNAUTHORIZED.value(), e.getMessage()));
                })
                // 前置函数：在每次认证函数之前执行
                .setBeforeAuth(r -> {
                    SaHolder.getResponse()
                            // 允许指定域访问跨域资源
                            .setHeader("Access-Control-Allow-Origin", "*")
                            // 允许所有请求方式
                            .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
                            // 有效时间
                            .setHeader("Access-Control-Max-Age", "3600")
                            // 允许的header参数
                            .setHeader("Access-Control-Allow-Headers", "*");
                    if (SaHolder.getRequest().getMethod().equals(HttpMethod.OPTIONS.toString())) {
                        SaRouter.back();
                    }
                });
    }

    // 注册sa-token的注解拦截器，打开注解式鉴权功能
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor()).addPathPatterns("/**");
    }
}
