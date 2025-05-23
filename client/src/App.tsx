import {memo, useCallback, useEffect, useMemo, useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;

const ExpensiveComponent = memo(({ onClick }: { onClick: () => void }) => {
    console.log("ExpensiveComponent rendered");
    return  <button onClick={onClick}>Click me!</button>
});

export default function App() {
    const [message, setMessage] = useState<string>("");
    const [count, setCount] = useState<number>(0);
    const [value, setValue] = useState<number>(10);

    useEffect(() => {
        fetch(`${API_URL}/welcome`)
            .then((res) => res.json())
            .then(data => setMessage(data.message))
            .catch(err => setMessage(`Error: ${err.message}`));
    }, []);

    const handleClick = useCallback(() => {
        console.log("Clicked!");
    }, []);

    const expensiveResult = useMemo(() => {
        console.log("calculating...");
        let total = 0;
        for (let i = 0; i < 100000000; i++) {
            total += value * 0.0000001;
        }
        return total.toFixed(2);
    }, [value]);

    return (
        <div className="App">
            <h1>Welcome to the React App</h1>
            <p>{message || "Loading..."}</p>
            <div style={{ marginTop: "20px" }}>
                <h1>Count: {count}</h1>
                <button onClick={() => setCount(count + 1)}>Increment</button>

                <h1>Expensive Result: {expensiveResult}</h1>
                <button onClick={() => setValue(value + 1)}>Recalculate</button>

                <ExpensiveComponent onClick={handleClick} />
            </div>
        </div>
    );
}
