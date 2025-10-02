import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

type Fabrika = { Id: number; EmriFabrikes: string; Lokacioni: string };
type Makina = {
  Id: number;
  Modeli: string;
  VitiProdhimit: number | null;
  EmriFabrikes?: string;
};

const FabrikaMakina: React.FC = () => {

  const [fabrikat, setFabrikat] = useState<Fabrika[]>([]);
  const [makinat, setMakinat] = useState<Makina[]>([]);


  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);


  const [selectedFabrika, setSelectedFabrika] = useState<number | "">("");


  const [emriFabrikes, setEmriFabrikes] = useState("");
  const [lokacioni, setLokacioni] = useState("");
  const [editFabrika, setEditFabrika] = useState<Fabrika | null>(null);


  const [modeli, setModeli] = useState("");
  const [viti, setViti] = useState<number | "">("");
  const [fabrikaId, setFabrikaId] = useState<number | "">("");

  const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  const flashOk = (msg: string) => {
    setOk(msg);
    setTimeout(() => setOk(null), 2000);
  };
  const flashErr = (msg: string) => {
    setErr(msg);
    setTimeout(() => setErr(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setErr(null);
      const resF = await api.get<Fabrika[]>("/fabrika/all");
      setFabrikat(resF.data);

      if (selectedFabrika) {
        const resM = await api.get<Makina[]>(`/makina/by-fabrika/${selectedFabrika}`);
        setMakinat(resM.data);
      } else {
        const resM = await api.get<Makina[]>("/makina/all");
        setMakinat(resM.data);
      }
    } catch (e: any) {
      flashErr(e?.response?.data?.error || "Nuk u ngarkuan të dhënat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    void loadData();

  }, [selectedFabrika]);


  const saveFabrika = async () => {
    if (!emriFabrikes.trim()) return flashErr("Shkruaj emrin e fabrikës.");
    try {
      setLoading(true);
      if (editFabrika) {
        await api.put(`/fabrika/update/${editFabrika.Id}`, {
          EmriFabrikes: emriFabrikes.trim(),
          Lokacioni: lokacioni.trim(),
        });
        flashOk("Fabrika u përditësua.");
      } else {
        await api.post(`/fabrika/add`, {
          EmriFabrikes: emriFabrikes.trim(),
          Lokacioni: lokacioni.trim(),
        });
        flashOk("Fabrika u shtua.");
      }
      setEmriFabrikes("");
      setLokacioni("");
      setEditFabrika(null);
      await loadData();
    } catch (e: any) {
      flashErr(e?.response?.data?.error || "Veprimi dështoi.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (f: Fabrika) => {
    setEditFabrika(f);
    setEmriFabrikes(f.EmriFabrikes);
    setLokacioni(f.Lokacioni);
  };


  const addMakina = async () => {
    if (!modeli.trim()) return flashErr("Shkruaj modelin.");
    if (!fabrikaId) return flashErr("Zgjidh fabrikën.");
    try {
      setLoading(true);
      await api.post(`/makina/add`, {
        Modeli: modeli.trim(),
        VitiProdhimit: viti === "" ? null : Number(viti),
        Id_Fabrika: Number(fabrikaId),
      });
      flashOk("Makina u shtua.");
      setModeli("");
      setViti("");
      setFabrikaId("");
      await loadData();
    } catch (e: any) {
      flashErr(e?.response?.data?.error || "Shtimi i makinës dështoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Navbar />

      <main className="flex-1 flex justify-center items-start p-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-4xl space-y-8">
          <h1 className="text-3xl font-bold text-center">🏭 Fabrika & 🚗 Makina</h1>


          {(ok || err) && (
            <div className="flex justify-center">
              {ok && <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">{ok}</div>}
              {err && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md">{err}</div>}
            </div>
          )}


          <section className="bg-white shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editFabrika ? "✏️ Përditëso Fabrikë" : "➕ Shto Fabrikë"}
              </h2>
              {loading && <span className="text-sm text-gray-500">Duke punuar…</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={emriFabrikes}
                onChange={(e) => setEmriFabrikes(e.target.value)}
                placeholder="Emri i Fabrikës"
                className="border rounded p-2"
              />
              <input
                value={lokacioni}
                onChange={(e) => setLokacioni(e.target.value)}
                placeholder="Lokacioni"
                className="border rounded p-2"
              />
              <button
                onClick={saveFabrika}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editFabrika ? "Ruaj" : "Shto"}
              </button>
            </div>
          </section>


          <section className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">➕ Shto Makina</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                value={modeli}
                onChange={(e) => setModeli(e.target.value)}
                placeholder="Modeli"
                className="border rounded p-2"
              />
              <input
                value={viti}
                onChange={(e) =>
                  setViti(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Viti i Prodhimit"
                type="number"
                className="border rounded p-2"
              />
              <select
                value={fabrikaId}
                onChange={(e) =>
                  setFabrikaId(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border rounded p-2"
              >
                <option value="">Zgjedh Fabrikën</option>
                {fabrikat.map((f) => (
                  <option key={f.Id} value={f.Id}>
                    {f.EmriFabrikes}
                  </option>
                ))}
              </select>
              <button
                onClick={addMakina}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Shto
              </button>
            </div>
          </section>


          <section className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">🔎 Filtrim sipas Fabrikës</h2>
            <select
              value={selectedFabrika}
              onChange={(e) =>
                setSelectedFabrika(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full border rounded p-2"
            >
              <option value="">Të gjitha fabrikat</option>
              {fabrikat.map((f) => (
                <option key={f.Id} value={f.Id}>
                  {f.EmriFabrikes}
                </option>
              ))}
            </select>
          </section>


          <section className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">📋 Lista e Fabrikave</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Emri</th>
                    <th className="p-2 border">Lokacioni</th>
                    <th className="p-2 border w-24">Opsione</th>
                  </tr>
                </thead>
                <tbody>
                  {fabrikat.map((f) => (
                    <tr key={f.Id} className="hover:bg-gray-50">
                      <td className="p-2 border">{f.EmriFabrikes}</td>
                      <td className="p-2 border">{f.Lokacioni}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => startEdit(f)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {fabrikat.length === 0 && (
                    <tr>
                      <td className="p-3 text-gray-500 text-center" colSpan={3}>
                        Nuk ka fabrika.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>


          <section className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">🚗 Lista e Makinave</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Modeli</th>
                    <th className="p-2 border">Viti</th>
                    <th className="p-2 border">Fabrika</th>
                  </tr>
                </thead>
                <tbody>
                  {makinat.map((m) => (
                    <tr key={m.Id} className="hover:bg-gray-50">
                      <td className="p-2 border">{m.Modeli}</td>
                      <td className="p-2 border">{m.VitiProdhimit ?? "—"}</td>
                      <td className="p-2 border">{m.EmriFabrikes ?? "—"}</td>
                    </tr>
                  ))}
                  {makinat.length === 0 && (
                    <tr>
                      <td className="p-3 text-gray-500 text-center" colSpan={3}>
                        Nuk ka makina.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FabrikaMakina;
