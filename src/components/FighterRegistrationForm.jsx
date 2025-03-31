import React, { useState } from 'react';

const FighterRegistrationForm = () => {
  const [nombre, setNombre] = useState('');
  const [club, setClub] = useState('');
  const [pais, setPais] = useState('');
  const [modalidad, setModalidad] = useState('Tradicional');

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoPeleador = { nombre, club, pais, modalidad };
    const claveAlmacenamiento = modalidad === 'Tradicional' ? 'peleadoresTradicional' : 'peleadoresFreestyle';

    const peleadoresExistentes = JSON.parse(localStorage.getItem(claveAlmacenamiento)) || [];
    peleadoresExistentes.push(nuevoPeleador);
    localStorage.setItem(claveAlmacenamiento, JSON.stringify(peleadoresExistentes));

    setNombre('');
    setClub('');
    setPais('');
    setModalidad('Tradicional');

    alert(`Peleador registrado en la modalidad ${modalidad} con éxito`);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-white">Registro de Competidores</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-gray-300">Nombre del deportista</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="club" className="block text-gray-300">Club</label>
            <input
              type="text"
              id="club"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="pais" className="block text-gray-300">País</label>
            <input
              type="text"
              id="pais"
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="modalidad" className="block text-gray-300">Modalidad</label>
            <select
              id="modalidad"
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="Tradicional">Tradicional</option>
              <option value="Freestyle">Freestyle</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default FighterRegistrationForm;
