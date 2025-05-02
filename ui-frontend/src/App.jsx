import "./App.css";
import CompanyUpload from "./components/CompanyUpload";
function App() {
  return (
    <>
      <h1 className="text-3xl font-bold bg-yellow-400">
        {import.meta.env.VITE_APP_NAME}
      </h1>
      <CompanyUpload></CompanyUpload>
    </>
  );
}

export default App;
