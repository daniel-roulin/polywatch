import styles from '@/ui/maps/iframe_map.module.css'

const IframeMap = () => {
    return <iframe
        src="https://plan.epfl.ch/iframe/?dim_floor=1&map_x=2533400&map_y=1152502&map_zoom=12"
        className={styles.map}
        name="Plan EPFL"
    ></iframe>;
};

export default IframeMap;