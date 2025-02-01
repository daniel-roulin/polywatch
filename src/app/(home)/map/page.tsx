// import Image from "next/image";
import DefaultMap from "@/ui/maps/default_map";
import IframeMap from "@/ui/maps/iframe_map";
import LeafletMap from "@/ui/maps/leaflet_map";
import WMTSMap from "@/ui/maps/OL_WMTS_map";
import XYZMap from "@/ui/maps/OL_XYZ_map";
import HelloWorld from "@/ui/component";
import dynamic from "next/dynamic";

import React from "react";

export default function Home() {
  const MapComponent = dynamic(() => import('@/ui/maps/leaflet_map'), { ssr: false });

  return (
    <main>
      <div id="map">
        <MapComponent />
      </div>
    </main>
  );
}

  // return (
  //   // <XYZMap />
  //   // <WMTSMap />
  //   // <DefaultMap />
  //   <LeafletMap />
  //   // <HelloWorld />
  // );
