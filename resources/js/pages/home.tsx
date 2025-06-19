import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import SPL from '@/components/spl';

export default function Home() {
  const [showSPL, setShowSPL] = useState(false); // awalnya tersembunyi

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">
          Sistem Persamaan Linear Solver
        </h1>
        
        <p className="text-lg text-gray-700 mb-8">
          Aplikasi web untuk menyelesaikan sistem persamaan linear dengan metode eliminasi Gauss.
          Masukkan koefisien persamaan Anda dan dapatkan solusi secara instan.
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Mulai Sekarang
          </h2>
          <p className="text-gray-600 mb-6">
            Klik tombol di bawah untuk mulai menggunakan solver persamaan linear.
          </p>

          {!showSPL ? (
            <button
              onClick={() => setShowSPL(true)}
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Buka SPL Solver
            </button>
          ) : (
            <SPL />
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Mudah Digunakan</h3>
            <p className="text-gray-600">
              Antarmuka sederhana yang memudahkan Anda memasukkan persamaan.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Akurat</h3>
            <p className="text-gray-600">
              Menggunakan metode eliminasi Gauss untuk solusi yang presisi.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Gratis</h3>
            <p className="text-gray-600">
              Tidak perlu bayar, gunakan sepuasnya untuk menyelesaikan persamaan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
