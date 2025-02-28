import { useState } from "react";
import axios from "axios";

function App() {
  const [serial, setSerial] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setData(null);
    try {
      const response = await axios.get(`http://localhost:5000/lookup/${serial}`);
      setData(response.data);
    } catch (err) {
      setError("Serial number not found");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-5">Serial Number Lookup</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="Enter Serial Number"
          className="p-2 border rounded-lg shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {data && (
        <div className="mt-5 p-4 border rounded bg-white shadow-md">
          <h2 className="text-xl font-semibold">Details:</h2>
          {Object.entries(data).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
