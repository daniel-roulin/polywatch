'use client';

import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';

import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import { ImageTile, OSM } from 'ol/source';
// import proj4 from 'proj4';
// import { register } from 'ol/proj/proj4.js';
// import { get as getProjection } from 'ol/proj.js';
// import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
// import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js';


const XYZMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        
        // TODO: 1. I should try to get version WMTS to work, it is the one that makes the most sense.
        // TODO: 2. If I really can't, I can write a custom loader for this version, based on https://github.com/openlayers/openlayers/blob/1e605bc242758bb89e91edc30a26d85f3256c73f/src/ol/source/ImageTile.js#L161
        // TODO: 3. The last option is to try Leaflet(probaby not capable): https://medium.com/@idris.maps/custom-projection-with-leafletjs-6ac7bb3ef4c2
        // TODO:    or GeoMapFish(probably not may examples)

        // This does not work, the tiles coordonates are too big
        // Now it works, but it's broken AF if you ask for swissProjection
        // Now it works even better but the coordinates are all over the place.... Time to sleep
        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            layers: [
                new TileLayer({
                    source: new ImageTile({
                        url: "https://prod-plan-epfl-tiles0.epfl.ch/1.0.0/osm-wmts/default/20230811/2056/{z}/{x}/{y}.png",
                    }),
                }),
            ],
            view: new View({
                center: [0, 0], // Center the map to an appropriate location
                zoom: 0, // Adjust zoom level
                // projection: swissProjection // Set to Swiss coordinate system
            })
        });
        return () => map.setTarget(undefined);
    }, []);
    return <div ref={mapDivRef} className='map' />;
};

export default XYZMap;