import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/Login';
import CategoriesPage from './pages/Categorias';
import PiezasPage from './pages/PiezasPage';
import SuministrosPage from './pages/SuministrosPage';
import ProveedoresPage from './pages/ProveedoresPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/Layout';
import CategoryForm from './pages/CategoryForm';
import PiezaForm from './pages/PiezaForm';
import ProviderForm from './pages/ProviderForm';
import SuministrosForm from './pages/SuministrosForm';
import Usuarios from './pages/Usuarios';
import UserForm from './pages/UserForm';


function App() {
  useEffect(() => {
    console.log('%c¡Alto ahí!', 'color: red; font-size: 32px; font-weight: bold;');
    console.log('%cEsta consola es una herramienta para desarrolladores. Si alguien te pidió que pegues algo aquí, podrías estar siendo víctima de un fraude (Self-XSS).', 'font-size: 16px;');
    console.log('%cNo pegues código que no comprendas.. /¿V?\..', 'color: orange; font-size: 18px; font-weight: bold;');
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/categorias/nueva" element={<CategoryForm />} />
          <Route path="/categorias/editar/:id" element={<CategoryForm />} />
          <Route path="/piezas/nueva" element={<PiezaForm />} />
          <Route path="/piezas/editar/:id" element={<PiezaForm />} />
          <Route path="/piezas" element={<PiezasPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/proveedores/nuevo" element={<ProviderForm />} />
          <Route path="/proveedores/editar/:id" element={<ProviderForm />} />
          <Route path="/suministros" element={<SuministrosPage />} />
          <Route path="/suministros/nuevo" element={<SuministrosForm />} />
          <Route path="/suministros/editar/:id" element={<SuministrosForm />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/nuevo" element={<UserForm />} />
          <Route path="/usuarios/editar/:id" element={<UserForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;