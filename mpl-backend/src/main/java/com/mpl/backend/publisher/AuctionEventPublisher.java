package com.mpl.backend.publisher;

import com.mpl.backend.model.AuctionUpdateEvent;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class AuctionEventPublisher {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe(){
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(()->emitters.remove(emitter));
        emitter.onTimeout(()->emitters.remove(emitter));
        emitter.onError(e->emitters.remove(emitter));


        try{
            emitter.send(SseEmitter.event().comment("connected"));

        }catch (IOException e){
            emitters.remove(emitter);
        }
        return emitter;
    }

    public synchronized void publish(AuctionUpdateEvent event){
        for(SseEmitter emitter:emitters){
            try {
                emitter.send(SseEmitter.event().name("auction-update")
                        .data(event, MediaType.APPLICATION_JSON));
            }catch ( Exception e){
                emitters.remove(emitter);
            }
        }
    }

    @Scheduled(fixedRate = 20_000)
    public synchronized void heartBeat(){
        for(SseEmitter emitter :emitters){
            try{
                emitter.send(SseEmitter.event().comment("keep-alive"));
            }catch (Exception e){
                emitters.remove(emitter);
            }
        }
    }
}
