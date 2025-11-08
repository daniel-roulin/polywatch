// import Image from "next/image";
import DefaultMap from "@/ui/plan/default_map";
import IframeMap from "@/ui/plan/iframe_map";
import LeafletMap from "@/ui/plan/leaflet_map";
import WMTSMap from "@/ui/plan/OL_WMTS_map";
import XYZMap from "@/ui/plan/OL_XYZ_map";
import dynamic from "next/dynamic";

import React from "react";

export default function Home() {
  const MapComponent = dynamic(() => import('@/ui/plan/leaflet_map'), { ssr: false });

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
