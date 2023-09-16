function Pokemon({ name, image }) {
    return (
        <div>
            <div>{name}</div>
            <div>
                <img src={image} alt="hi" />
            </div>
        </div>
    );
}
export default Pokemon;
