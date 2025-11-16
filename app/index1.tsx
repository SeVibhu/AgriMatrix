import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchExcel } from '../utils/fetchExcel';

export default function App() {
  const [data, setData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const url = 'https://docs.google.com/spreadsheets/d/1mvnW5fJHOpMAIZKygCOZdyR_8YEX66eT/export?format=xlsx';
        const rows = await fetchExcel(url);
        setData(rows);
      } catch (error) {
        console.error('Failed to load Excel data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView horizontal>
      <View style={styles.table}>
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <Text key={cellIndex} style={styles.cell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cell: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 100,
    textAlign: 'center',
  },
});