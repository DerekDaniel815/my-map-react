import Map from '../components/Map';

const App = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        Mapa de mi ubicacion
      </h1>
      <Map />
    </div>
  )
}

export default App