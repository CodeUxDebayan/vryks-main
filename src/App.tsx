import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { HeroPage } from './pages/HeroPage';
import { EnterStudioPage } from './pages/EnterStudioPage';
import { FourPillarsPage } from './pages/FourPillarsPage';
import { ClientsPage } from './pages/ClientsPage';
import { WhyChooseUsPage } from './pages/WhyChooseUsPage';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<HeroPage />} />
        <Route path="/enter-studio" element={<EnterStudioPage />} />
        <Route path="/four-pillars" element={<FourPillarsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
      </Routes>
    </Router>
  );
}
