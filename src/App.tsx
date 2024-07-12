import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./page/Home";
import Quest from "./page/Quest";
import { ToastContainer } from "react-toastify";
// import Footer from "./component/Footer";
import Layout from "./Layout";
import Streak from "./page/Streak";
import Leaderboard from "./component/Leaderboard";
import Boost from "./user_ability/boost";
import Referrals from "./page/Referrals";
import { EnergyProvider } from "./hooks/EnergyContext";

function App() {
  return (
    <EnergyProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="quest" element={<Quest />} />
              <Route path="dailybonus" element={<Streak />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="boost" element={<Boost />} />
              <Route path="refs" element={<Referrals />} />
            </Route>
          </Routes>
          <ToastContainer />
          {/* <Footer /> */}
        </div>
      </Router>
    </EnergyProvider>
  );
}

export default App;
