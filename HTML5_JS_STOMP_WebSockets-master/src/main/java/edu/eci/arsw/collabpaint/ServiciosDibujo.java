package edu.eci.arsw.collabpaint;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.model.Polygon;

public class ServiciosDibujo {
    private ConcurrentHashMap<String, ArrayBlockingQueue<Point>> dibujosPuntos = new ConcurrentHashMap<>();

    public ServiciosDibujo() {

    }

    public void agregarPunto(String numDibujo, Point punto) {
        if (!dibujosPuntos.containsKey(numDibujo)) {
            ArrayBlockingQueue<Point> puntosDibujo = new ArrayBlockingQueue<>(100);
            puntosDibujo.add(punto);
            dibujosPuntos.put(numDibujo, puntosDibujo);
        } else {
            ArrayBlockingQueue<Point> puntosDibujo = dibujosPuntos.get(numDibujo);
            puntosDibujo.add(punto);
            dibujosPuntos.replace(numDibujo, puntosDibujo);
        }
    }

    public ArrayBlockingQueue<Point> getPuntosPoligono(String numDibujo) {
        ArrayBlockingQueue<Point> puntosPoligono = dibujosPuntos.get(numDibujo);
        System.out.println("puntos a dibujar: " + puntosPoligono);
        return puntosPoligono;
    }

    public boolean poligonoCompleto(String numDibujo) {
        boolean estaCompleto = false;
        if (dibujosPuntos.get(numDibujo).size() >= 4) {
            System.out.println("DIBUJAR POLIGONO");
            estaCompleto = true;
        }
        return estaCompleto;
    }

    public void resetPoligono(String numDibujo) {
        dibujosPuntos.get(numDibujo).clear();
    }

}