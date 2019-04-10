
package edu.eci.arsw.collabpaint;

import java.util.ArrayList;
import java.util.List;

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
    private int cont = 0;
    private List<Point> puntos = new ArrayList<>();
    private List<Polygon> poligonos = new ArrayList<>();

    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:" + pt);
        System.out.println(cont);
        if (cont < 3) {
            puntos.add(pt);
            msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);
            cont++;
        } else {
            puntos.add(pt);
            Polygon pol = new Polygon(puntos);
            cont = 0;
            System.out.println("POLIGONO");
            msgt.convertAndSend("/topic/newpolygon." + numdibujo, puntos);
            puntos.clear();
        }
    }
}