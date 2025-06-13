import axios from "axios";

// Instancia de Axios con configuración global
const api = axios.create({
  baseURL: "https://backend-poli-ia-xhz9.onrender.com", // URL base de tu backend
  // timeout: 90000, // Tiempo máximo de espera
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para obtener datos del backend con historial de mensajes
export const fetchData = async (messageHistory: { role: string; content: string }[]) => {
  try {
    const response = await api.post("/chat", { messages: messageHistory });
    return response.data.response; // Suponiendo que el backend devuelve { response: "Texto de respuesta" }
  } catch (error) {
    console.error("Error obteniendo datos:", error);
    throw error;
  }
};

export default api;
