import { useState, useEffect } from "react";

const FightSelector = ({ modalidad = "Tradicional" }) => {
    const [fighters, setFighters] = useState([]);
    const [selectedFighter, setSelectedFighter] = useState("");
    const [scores, setScores] = useState({});
    const [showRankings, setShowRankings] = useState(false);
  
    const criteriosTradicional = [
      "Precisión Técnica", 
      "Equilibrio", 
      "Velocidad y Potencia", 
      "Ritmo y Tiempo", 
      "Expresión de la Energía"
    ];
    
    const criteriosFreestyle = [
      "Habilidades Técnicas (máx. 5.0)",
      "Movimientos Básicos & Practicidad (máx. 1.0)",
      "Creatividad (máx. 1.0)",
      "Armonía (máx. 1.0)",
      "Expresión de la Energía (máx. 1.0)",
      "Música & Coreografía (máx. 1.0)"
    ];

    const getMaxScore = (criterion) => {
      if (modalidad === "Tradicional") return 10;
      
      if (criterion.includes("Habilidades Técnicas")) return 5.0;
      if (criterion.includes("Movimientos Básicos")) return 1.0;
      if (criterion.includes("Creatividad")) return 1.0;
      if (criterion.includes("Armonía")) return 1.0;
      if (criterion.includes("Expresión")) return 1.0;
      if (criterion.includes("Música")) return 1.0;
      
      return 10;
    };

    const getCriterios = () => {
      return modalidad === "Tradicional" ? criteriosTradicional : criteriosFreestyle;
    };
  
    useEffect(() => {
      const storageKey = modalidad === "Tradicional" ? "peleadoresTradicional" : "peleadoresFreestyle";
      const storedFighters = JSON.parse(localStorage.getItem(storageKey)) || [];
      setFighters(storedFighters);
    }, [modalidad]);
  
    const handleStartEvaluation = () => {
      if (!selectedFighter) {
        alert("Selecciona un peleador");
        return;
      }
      setScores({ [selectedFighter]: {} });
    };
  
    const handleScoreChange = (fighter, criterion, value) => {
      const maxScore = getMaxScore(criterion);
      let parsedValue = parseFloat(value) || 0;
      
      // Limitar al valor máximo permitido
      if (parsedValue > maxScore) {
        parsedValue = maxScore;
      }
      
      setScores((prevScores) => ({
        ...prevScores,
        [fighter]: {
          ...prevScores[fighter],
          [criterion]: parsedValue,
        },
      }));
    };
  
    const handleRegisterScores = () => {
      const storageKey = modalidad === "Tradicional" ? "peleadoresTradicional" : "peleadoresFreestyle";
      const updatedFighters = fighters.map((fighter) => {
        if (fighter.nombre === selectedFighter) {
          const totalScore = Object.values(scores[fighter.nombre] || {}).reduce((a, b) => a + b, 0);
          return { ...fighter, totalScore: (fighter.totalScore || 0) + totalScore };
        }
        return fighter;
      });
  
      setFighters(updatedFighters);
      localStorage.setItem(storageKey, JSON.stringify(updatedFighters));
  
      setSelectedFighter("");
      setScores({});
    };
  
    const getSortedRankings = () => {
      return fighters.slice().sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
       <h2 className="text-2xl font-bold mb-4 text-center">Evaluación Individual - {modalidad}</h2>
      
      <div className="flex flex-col gap-4">
        <select
          className="p-2 bg-gray-700 border rounded"
          value={selectedFighter}
          onChange={(e) => setSelectedFighter(e.target.value)}
        >
          <option value="">Selecciona un Peleador</option>
          {fighters.map((fighter) => (
            <option key={fighter.nombre} value={fighter.nombre}>{fighter.nombre}</option>
          ))}
        </select>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded cursor-pointer"
          onClick={handleStartEvaluation}
          disabled={!selectedFighter}
        >
          Iniciar Evaluación
        </button>
      </div>
      {selectedFighter && scores[selectedFighter] !== undefined && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-center">{selectedFighter}</h3>
          <div className="space-y-4">
            {getCriterios().map((criterion) => (
              <div key={criterion} className="flex justify-between items-center">
                <span className="w-1/2">{criterion}</span>
                <input
                  type="number"
                  min="0"
                  max={getMaxScore(criterion)}
                  step="0.1"
                  className="p-2 w-20 bg-gray-800 border border-gray-600 rounded text-center"
                  value={scores[selectedFighter][criterion] || ""}
                  onChange={(e) => handleScoreChange(selectedFighter, criterion, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        className="mt-4 w-full bg-green-600 hover:bg-green-700 p-2 rounded cursor-pointer"
        onClick={handleRegisterScores}
      >
        Registrar Puntos
      </button>

      <button
        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 p-2 rounded cursor-pointer"
        onClick={() => setShowRankings(!showRankings)}
      >
        {showRankings ? "Ocultar Clasificaciones" : "Ver Clasificaciones"}
      </button>

      {/* Modal de clasificaciones */}
      {showRankings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo con blur y oscurecimiento */}
          <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowRankings(false)}
          />

          {/* Contenido del modal */}
          <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
            <div className="p-6">
              {/* Cabecera con botón de cerrar */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">
                  Clasificación de competidores
                </h3>
                <button
                  onClick={() => setShowRankings(false)}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Tabla de clasificaciones */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider">
                        Posición
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider">
                        Competidor
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider">
                        País
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider">
                        Club
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-200 uppercase tracking-wider">
                        Puntos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {getSortedRankings().map((fighter, index) => (
                      <tr
                        key={fighter.nombre}
                        className="hover:bg-gray-750 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-100">
                          #{index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-200">
                          {fighter.nombre}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                          {fighter.pais || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                          {fighter.club || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-yellow-400">
                          {fighter.totalScore?.toFixed(1) || 0} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FightSelector;
