import "./Pokemon.css";
function Pokemon({ name, image }) {
    return (
        <div className="pokemon">
            <div className="pokemon-name">{name}</div>
            <div>
                <img src={image} className="pokemon-image" alt="hi" />
            </div>
        </div>
    );
}
export default Pokemon;
