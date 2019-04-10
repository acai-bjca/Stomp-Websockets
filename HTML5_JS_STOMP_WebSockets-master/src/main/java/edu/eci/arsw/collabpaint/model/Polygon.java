package edu.eci.arsw.collabpaint.model;

import java.util.List;

public class Polygon {
    private List<Point> puntos;

    public Polygon(List<Point> puntos) {
        this.puntos = puntos;

    }

    public List<Point> getPuntos() {
        return puntos;
    }

}