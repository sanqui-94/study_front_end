import {Link, Route, Routes} from "react-router-dom";
import FavoritesList from "./components/FavoritesList.tsx";
import StrategyView from "./components/StrategyView.tsx";
import DailyReminder from "./components/DailyReminder.tsx";
import SearchStrategy from "./components/SearchStrategy.tsx";

export default function App() {

    return (
        <div className="min-h-screen bg-page-bg font-inria">
            <nav className="bg-white shadow p-4 mb-6">
                <ul className="flex space-x-4 container mx-auto">
                    <li><Link className="hover:underline" to="/">Home</Link></li>
                    <li><Link className="hover:underline" to="/favorites">Favorites</Link></li>
                    <li><Link className="hover:underline" to="/search">Search</Link></li>
                    <li><Link className="hover:underline" to="/daily">Daily</Link></li>
                </ul>
            </nav>

            <div className="container mx-auto px-4">
                <Routes>
                    <Route path="/" element={<StrategyView/>}/>
                    <Route path="/favorites" element={<FavoritesList/>}/>
                    <Route path="/daily" element={<DailyReminder/>}/>
                    <Route path="/search" element={<SearchStrategy/>}/>
                </Routes>
            </div>
        </div>

    );
}
