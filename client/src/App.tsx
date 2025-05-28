import {Link, Route, Routes} from "react-router-dom";
import FavoritesList from "./components/FavoritesList.tsx";
import StrategyView from "./components/StrategyView.tsx";
import DailyReminder from "./components/DailyReminder.tsx";
import SearchStrategy from "./components/SearchStrategy.tsx";

export default function App() {

    return (
        <div className="App">
            <div>
                <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <Link to="/">Home</Link>
                    <Link to="/favorites">Favorites</Link>
                    <Link to="/daily">Daily</Link>
                    <Link to="/search">Search</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<StrategyView />} />
                    <Route path="/favorites" element={<FavoritesList />} />
                    <Route path="/daily" element={<DailyReminder />} />
                    <Route path="/search" element={<SearchStrategy />} />
                </Routes>
            </div>
        </div>
    );
}
