import {useEffect, useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        fetch(`${API_URL}/welcome`)
            .then((res) => res.json())
            .then(data => setMessage(data.message))
            .catch(err => setMessage(`Error: ${err.message}`));
    }, []);

    return (
        <div className="App">
            <h1>Welcome to the React App</h1>
            <p>{message || "Loading..."}</p>
        </div>
    );
}
