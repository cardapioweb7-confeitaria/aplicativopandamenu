"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioPage from "./pages/Inicio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota principal agora carrega a página Inicio, que gerencia as abas */}
        <Route path="/" element={<InicioPage />} />
        
        {/* Você pode adicionar outras rotas aqui, como a de login */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;