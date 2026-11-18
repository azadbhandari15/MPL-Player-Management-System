package com.mpl.backend.controller;

import com.mpl.backend.store.AdminTokenStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import com.mpl.backend.interceptor.AdminAuthInterceptor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("mpl/admin")
public class AdminAuthController {

    record LoginRequest(String username,String password){}
    record LoginResponse(String token){}

    private final AdminTokenStore adminTokenStore;
    private final String adminUserName;
    private final String adminPassword;

    public AdminAuthController(AdminTokenStore adminTokenStore, @Value("${mpl.admin.username}") String adminUserName,
                               @Value("${mpl.admin.password}") String adminPassword) {
        this.adminTokenStore = adminTokenStore;
        this.adminUserName = adminUserName;
        this.adminPassword = adminPassword;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        boolean isValidLogin=safeEquals(loginRequest.username(), adminUserName) & safeEquals(loginRequest.password(),adminPassword);

        if(!isValidLogin){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Invalid Username and Password"));
        }

        return ResponseEntity.ok(new LoginResponse(adminTokenStore.issue()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value="Authorization", required = false) String auth){
        adminTokenStore.revoke(AdminAuthInterceptor.extractToken(auth));
        return ResponseEntity.noContent().build();
    }

    private boolean safeEquals(String a,String b){
        if(a==null || b==null){
            return false;
        }
        return  MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8)
                ,b.getBytes(StandardCharsets.UTF_8));
    }
}
