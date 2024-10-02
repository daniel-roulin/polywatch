import styles from '@/ui/maps/iframe_map.module.css'

// A considérer absolument: https://plan.epfl.ch/buildings.html
// https://www.epfl.ch/campus/services/website/fr/publier-sur-le-web-epfl/plan/page-155678-fr-html/
const IframeMap = () => {
    return <iframe
        src="https://plan.epfl.ch/iframe/?dim_floor=1&map_x=2533400&map_y=1152502&map_zoom=12"
        className={styles.map}
        name="Plan EPFL"
    ></iframe>;
};

export default IframeMap;