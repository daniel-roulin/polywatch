'use client';

import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';

import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';

const OpenLayersMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });

        return () => map.setTarget(undefined);
    }, []);

    return <div ref={mapDivRef} className='map' />;
};

export default OpenLayersMap;