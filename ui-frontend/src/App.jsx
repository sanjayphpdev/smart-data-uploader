import "./App.css";
import CompanyUpload from "./components/CompanyUpload";
function App() {
  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3x font-bold bg-yellow-400">
          {import.meta.env.VITE_APP_NAME}
        </h1>
        <CompanyUpload></CompanyUpload>
      </div>
    </>
  );
}

export default App;
