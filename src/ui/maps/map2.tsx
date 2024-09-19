'use client';

import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';

import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import { ImageTile, OSM } from 'ol/source';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import { get as getProjection } from 'ol/proj.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js';


const OpenLayersMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    // useEffect to runs only on the first render
    useEffect(() => {
        proj4.defs("EPSG:2056", "+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs");
        register(proj4);
        const swissProjection = getProjection('EPSG:2056') ?? undefined;

        // This does not work: no tile are requested
        // let map;
        // const parser = new WMTSCapabilities();
        // fetch('https://prod-plan-epfl-tiles0.epfl.ch/1.0.0/WMTSCapabilities_new_prod_2056.xml')
        //     .then(function (response) {
        //         return response.text();
        //     })
        //     .then(function (text) {
        //         const result = parser.read(text);
        //         const options = optionsFromCapabilities(result, {
        //             layer: "osm-wmts",
        //             matrixSet: "EPSG:2056",
        //         });
        //         console.log(options);
        //         if (!options)
        //         {
        //             throw new Error("Could not parse options");
        //         }

        //         map = new Map({
        //             layers: [
        //                 new TileLayer({
        //                     opacity: 1,
        //                     source: new WMTS(options),
        //                 }),
        //             ],
        //             target: mapDivRef.current as HTMLDivElement,
        //             view: new View({
        //                 center: [2533010, 1152471],
        //                 zoom: 20,
        //             }),
        //         });

        //         console.log(map);
        //     });

        // TODO: 1. I should try to get version 1 to work, it is the one that makes the most sense.

        // TODO: 2. If I really can't, I can write a custom loader for this version, based on https://github.com/openlayers/openlayers/blob/1e605bc242758bb89e91edc30a26d85f3256c73f/src/ol/source/ImageTile.js#L161
        // TODO: 3. The last option is to try Leaflet(probaby not capable): https://medium.com/@idris.maps/custom-projection-with-leafletjs-6ac7bb3ef4c2
        // or GeoMapFish(probably not may examples)
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


        console.log("hi mum!");

        // This works: 
        // ...but it is the default osm map example
        // const map = new Map({
        //     target: mapDivRef.current as HTMLDivElement,
        //     layers: [
        //       new TileLayer({
        //         source: new OSM(),
        //       }),
        //     ],
        //     view: new View({
        //       center: [0, 0],
        //       zoom: 2,
        //     }),
        //   });

    }, []);

    return <div ref={mapDivRef} className='map' />;
};

export default OpenLayersMap;