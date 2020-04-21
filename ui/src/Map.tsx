import React, { useRef, useState, useEffect, useReducer, CSSProperties } from 'react';
import mapboxgl, { Map, Marker, LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2ViYXN0aWFuY3V5IiwiYSI6ImNrOTQxZjA4MzAxaGIzZnBwZzZ4c21idHIifQ._2-exYw4CZRjn9WoLx8i1A';


const mapContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '0',
    right: '0',
    left: '0',
    bottom: '0'
};


type MapOptions = { zoom: number, center: [number, number]};


export default ({ results }: { results: any[] }) => {

    const [map, setMap] = useState(null);
    const [, setMarkers] = useReducer(reduceMarkers, []);
    const mapOptions: MapOptions = { zoom: 2, center: [50, 50] };
    const mapContainer = useRef(null);

    useEffect(() => { map ?? setMap(initializeMap(mapOptions, mapContainer.current)); }, [map, mapOptions]);

    useEffect(() => setMarkers({ map, results: results.filter(hasPointGeometry) }), [map, results]);

    return <div ref={mapContainer} style={mapContainerStyle}/>;
}


const initializeMap = (mapOptions: MapOptions, containerEl: HTMLElement) => new Map({
    container: containerEl,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: mapOptions.center,
    zoom: mapOptions.zoom
});


const reduceMarkers = (markers: Array<Marker>, { map, results }: { map: Map, results: any[] }) => {

    markers.forEach(marker => marker.remove());
    if (map && results.length)
        map.fitBounds(getBounds(results), { padding: 100 });
    return results.map(result => new Marker()
        .setLngLat(result.geometry.coordinates)
        .addTo(map)
    );
};

const getBounds = (results: any[]) => 
    results.reduce((bounds, result) =>
        bounds.extend(result.geometry.coordinates), new LngLatBounds());

const hasPointGeometry = resource => resource.geometry && resource.geometry.type === 'Point';