
// src/api/dataApi.ts
import { Platform } from "react-native";

// Replace with your Mac’s IP address
const LAN_IP = "http://192.168.50.96:8081"; 
const LOCALHOST = "http://localhost:8081";

// 👇 Auto-switch depending on platform
const API_URL = Platform.OS === "ios" || Platform.OS === "android" ? LAN_IP : LOCALHOST;

export async function fetchDataFromServer() {
  const response = await fetch(`${API_URL}/items`);
  return response.json();
}

export async function pushUpdateToServer(item: { id: number; name: string }) {
  await fetch(`${API_URL}/items/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export async function addItemToServer(item: { name: string }) {
  await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}


