package com.mpl.backend.component;


import com.mpl.backend.model.LiveAuctionState;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicReference;

@Component
public class LiveAuctionHolder {

    private final AtomicReference<LiveAuctionState> current=new AtomicReference<>();
    public LiveAuctionState get(){ return current.get();}
    public void set(LiveAuctionState state){current.set(state);}
    public void clear(){current.set(null);}
}
