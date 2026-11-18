package com.mpl.backend.interceptor;

import com.mpl.backend.store.AdminTokenStore;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final AdminTokenStore adminTokenStore;

    public AdminAuthInterceptor(AdminTokenStore adminTokenStore) {
        this.adminTokenStore = adminTokenStore;
    }

    public static String extractToken(String header){
        if(header!=null && header.startsWith("Bearer ")){
            return  header.substring(7).trim();
        }
        return null;
    }

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException {
        if("OPTIONS".equals(req.getMethod()))
            return true;

        if(adminTokenStore.isValid(extractToken(req.getHeader("Authorization")))){
            return true;
        }

        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType("application/json");
        res.getWriter().write("{\"message\":\"Unauthorized\"}");
        return false;

    }

}
