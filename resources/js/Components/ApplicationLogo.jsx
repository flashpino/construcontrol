export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/img/logo-sf.png" 
            alt="Grupo SF" 
            className={`object-contain ${props.className || ''}`}
        />
    );
}
