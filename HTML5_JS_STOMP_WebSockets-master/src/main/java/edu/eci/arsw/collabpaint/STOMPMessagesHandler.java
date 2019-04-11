
package edu.eci.arsw.collabpaint;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;

import com.google.gson.Gson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.model.Polygon;

@Controller
public class STOMPMessagesHandler {
    private ServiciosDibujo serviciosDibujo = new ServiciosDibujo();

    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:" + pt);
        msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);
        serviciosDibujo.agregarPunto(numdibujo, pt);
        if (serviciosDibujo.poligonoCompleto(numdibujo)) {
            ArrayBlockingQueue<Point> puntos = serviciosDibujo.getPuntosPoligono(numdibujo);
            System.out.println("puntos a dibujar: " + puntos);
            msgt.convertAndSend("/topic/newpolygon." + numdibujo, puntos);
            serviciosDibujo.resetPoligono(numdibujo);
        }
    }
}