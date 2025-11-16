import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { fetchDataFromServer, pushUpdateToServer } from "../api/dataApi";
import { getLocalData, initDb, markUnsyncedChange, saveDataLocally } from "../storage/localDb";

import NetInfo from "@react-native-community/netinfo";

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processQueue(setData);
    }
  });
  return () => unsubscribe();
}, []);

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    initDb();
    loadLocal();
    syncWithServer();
  }, []);

  const loadLocal = () => {
    getLocalData(rows => setData(rows));
  };

  const syncWithServer = async () => {
    try {
      const serverData = await fetchDataFromServer();
      saveDataLocally(serverData);
      loadLocal();
    } catch (err) {
      console.log("Offline mode, using local data");
    }
  };

  const updateItem = async (item: any) => {
    // Save locally as unsynced
    markUnsyncedChange(item);
    setData(prev => prev.map(d => (d.id === item.id ? item : d)));

    // Try pushing to server
    try {
      await pushUpdateToServer(item);
      syncWithServer();
    } catch {
      console.log("Will sync later when online");
    }
  };

  

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Update" onPress={() => updateItem({ ...item, name: "Updated!" })} />
          </View>
        )}
      />
      <Button title="Sync Now" onPress={syncWithServer} />
    </View>
  );
}