'use client';

import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js';

const WMTSMap = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null); // Track map object with useRef

  useEffect(() => {
    proj4.defs(
      'EPSG:2056',
      '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs'
    );
    register(proj4);

    const parser = new WMTSCapabilities();
    fetch('https://prod-plan-epfl-tiles0.epfl.ch/1.0.0/WMTSCapabilities_new_prod_2056.xml')
      .then((response) => response.text())
      .then((text) => {
        const result = parser.read(text);
        const options = optionsFromCapabilities(result, {
          layer: 'osm-wmts',
          matrixSet: 'EPSG:2056',
        });

        if (!options) {
          throw new Error('Could not parse options');
        }

        const wmts = new WMTS(options);

        console.log(wmts);

        if (mapRef.current === null) {
          // Create map only once
          mapRef.current = new Map({
            layers: [
              new TileLayer({
                opacity: 1,
                source: wmts,
              }),
            ],
            target: mapDivRef.current as HTMLDivElement,
            view: new View({
              center: [2533010, 1152471],
              zoom: 20,
            }),
          });
        }
      });

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null); // Clean up map on unmount
      }
    };
  }, []);

  return <div ref={mapDivRef} className="map" />;
};

export default WMTSMap;
