package com.mpl.backend.store;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AdminTokenStore {


    private static final Duration TTL=Duration.ofHours(8);
    private final Map<String, Instant> tokens=new ConcurrentHashMap<>();
    private final SecureRandom random=new SecureRandom();

    public String issue(){
        byte[] bytes=new byte[32];
        random.nextBytes(bytes);
        String token= Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        tokens.put(token,Instant.now().plus(TTL));
        return token;
    }

    public boolean isValid(String token){
        if(token==null)
            return false;

        Instant expiry=tokens.get(token);
        if(expiry==null)
            return false;
        if(expiry.isBefore(Instant.now())){
            tokens.remove(token);
            return false;
        }

        return true;
    }

    public void revoke(String token){
        if(token!=null){
            tokens.remove(token);
        }
    }
}
