
interface IconProps {
    className?: string;
}

// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:open_in_new:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=open&icon.size=24&icon.color=%23FFFFFF
const OpenInNewIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
        className={className}
    >
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
    </svg>
);

export default OpenInNewIcon;