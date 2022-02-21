import useError from "../context/error/error";

export const Error = () => {
    const {errorMessage, errorVisible, setErrorVisible} = useError();
    return (
        <div className={`error--container ${errorVisible ? "visible" : ""}`}>
            <div>
                {errorMessage}
            </div>
            <div style={{cursor: "pointer"}} onClick={() => setErrorVisible(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" focusable="false" data-prefix="fal"
                     className="svg-inline--fa fa-times-circle fa-w-16" role="img"
                     viewBox="0 0 512 512">
                    <path fill="#333"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z"/>
                </svg>
            </div>
        </div>
    )

};