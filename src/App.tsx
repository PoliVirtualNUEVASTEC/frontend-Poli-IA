//import { useState } from "react";
import "./App.css";
import ChatbotWidget from "./components/ChatbotWidget";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <div className="App">
      {/* <div className="img_polivirtual">
        <img src="chatbot-frontend\src\assets\image.png"/>
      </div> */}
      <h1>Bienvenido a mi Chatbot</h1>
      <ChatbotWidget />
    </div>
    
  );
}

export default App;
