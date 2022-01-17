package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 회원가입 API ([POST] /api/v1/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserRegisterPostRequest")
public class UserRegisterPostReq {
	@ApiModelProperty(name="유저 ID", example="ssafy205")
	String userId;
	@ApiModelProperty(name="유저 Password", example="ssafy")
	String userPw;
	@ApiModelProperty(name="유저 NickName", example="구미_4반_김은준")
	String userNickname;
	@ApiModelProperty(name="유저 Phone", example="010-1234-1234")
	String userPhone;
	@ApiModelProperty(name="유저 Type", example="1")
	int userType;
}
