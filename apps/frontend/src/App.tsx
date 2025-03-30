import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Layout } from './pages/Layout';
import { NotFound } from './pages/NotFound';
import { Signup } from './pages/Signup';
import { LoginPage } from './pages/login/Login';
import { Paths } from './Paths';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={Paths.ROOT} element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={Paths.SIGNUP} element={<Signup />} />
        <Route path={Paths.LOGIN} element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
