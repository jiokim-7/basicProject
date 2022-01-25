package com.ssafy.api.controller;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserSocialReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.NoSuchElementException;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Auth."})
@RestController
public class AuthController {
    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @ApiOperation(value = "로그인", notes = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<UserLoginPostRes> login(@RequestBody @ApiParam(value = "로그인 요청 정보", required = true) UserLoginPostReq loginInfo) {
        String userId = loginInfo.getUserId();
        String password = loginInfo.getUserPw();
        try {
            User user = userService.getUserByUserId(userId);
            // 패스워드 일치 여부 확인
            if (passwordEncoder.matches(password, user.getUserPw())) {
                // 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
                return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userId), user.getUserNickname()));
            }
            // 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
            return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "Invalid Password", null, null));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(UserLoginPostRes.of(404, "사용자 없음", null, null));
        }

    }

    @PostMapping("/social-login")
    @ApiOperation(value = "소셜 로그인", notes = "<strong>소셜 로그인 정보</strong>를 통해 정보를 저장하고 로그인 한다.")
    public ResponseEntity<? extends UserLoginPostRes> socialLogin(
            @Valid @RequestBody @ApiParam(value = "소셜 로그인 정보", required = true) UserSocialReq socialInfo) {
        String userId = "Social_" + socialInfo.getUserId();
        try {
            User user = userService.getSocialUserByUserId(userId);
            return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(user.getUserId()), user.getUserNickname()));
        } catch (NoSuchElementException e) {
            userService.createSocialUser(socialInfo);
            User user = userService.getSocialUserByUserId(userId);
            return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(user.getUserId()), user.getUserNickname()));
        }

    }
}
