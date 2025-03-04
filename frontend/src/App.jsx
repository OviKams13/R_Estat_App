import Navbar from "./components/navbar/Navbar";
import "./layout.scss"; // Import the layout styles
import HomePage from "./routes/homePage/homePage";

function App() {
  return (
    <div className="layout">
      <div className="navbar">
      <Navbar />  
      </div>
      <div className="content">
      <HomePage />  
      </div>
    </div>
  );
}

export default App;
