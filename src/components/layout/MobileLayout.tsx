"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Wrench,
  Users
} from "lucide-react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[#1a0033] text-white w-14 h-14 flex items-center justify-center shadow-lg z-50"
      >
        ☰
      </button>

      {/* MENU SUSPENSO */}
      {open && (
        <div className="fixed bottom-24 right-6 bg-[#140028] p-4 shadow-2xl z-40 min-w-[220px]">

          <div className="flex flex-col gap-3">

            {/* INÍCIO (COM SEU PNG) */}
            <button
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
              className="flex items-center gap-3 text-white bg-[#1f003d] px-4 py-3 shadow-md w-full text-left"
            >
              <img
                src="/icons/homeapp.png"
                alt="Início"
                className="w-6 h-6"
              />
              <span>Início</span>
            </button>

            {/* CARDÁPIO */}
            <button
              onClick={() => {
                navigate("/cardapio");
                setOpen(false);
              }}
              className="flex items-center gap-3 text-white bg-[#1f003d] px-4 py-3 shadow-md w-full text-left"
            >
              <Utensils size={20} />
              <span>Cardápio</span>
            </button>

            {/* UTILITÁRIOS */}
            <button
              onClick={() => {
                navigate("/utilitarios");
                setOpen(false);
              }}
              className="flex items-center gap-3 text-white bg-[#1f003d] px-4 py-3 shadow-md w-full text-left"
            >
              <Wrench size={20} />
              <span>Utilitários</span>
            </button>

            {/* COMUNIDADE */}
            <button
              onClick={() => {
                navigate("/comunidade");
                setOpen(false);
              }}
              className="flex items-center gap-3 text-white bg-[#1f003d] px-4 py-3 shadow-md w-full text-left"
            >
              <Users size={20} />
              <span>Comunidade</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
}
