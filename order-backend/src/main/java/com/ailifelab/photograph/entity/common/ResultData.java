package com.ailifelab.photograph.entity.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ResultData<T> {

    private Integer code;
    private String msg;
    private T data;


    public static <T> ResultData<T> success(T data) {
        ResultData<T> resultData = new ResultData<T>();
        resultData.setData(data);
        resultData.setCode(HttpStatus.OK.value());
        return resultData;
    }

    public static <T> ResultData<T> success(T data, String msg) {
        ResultData<T> resultData = new ResultData<T>();
        resultData.setData(data);
        resultData.setCode(HttpStatus.OK.value());
        resultData.setMsg(msg);
        return resultData;
    }

    public static <T> ResultData<T> fail(String msg) {
        ResultData<T> resultData = new ResultData<T>();
        resultData.setMsg(msg);
        resultData.setCode(HttpStatus.BAD_REQUEST.value());
        return resultData;
    }

    public static <T> ResultData<T> fail(Integer statusCode, String msg) {
        ResultData<T> resultData = new ResultData<T>();
        resultData.setMsg(msg);
        resultData.setCode(statusCode);
        return resultData;
    }

}
