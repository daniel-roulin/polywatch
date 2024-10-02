// import Image from "next/image";
import DefaultMap from "@/ui/maps/default_map";
import IframeMap from "@/ui/maps/iframe_map";
import WMTSMap from "@/ui/maps/OL_WMTS_map";
import XYZMap from "@/ui/maps/OL_XYZ_map";

export default function Page() {
  return (
    // <XYZMap />
    <WMTSMap />
    // <DefaultMap />
  );
}
