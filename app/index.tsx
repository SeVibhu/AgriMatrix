import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchExcel } from '../utils/fetchExcel';

// Excel base date (Dec 30, 1899)
const excelEpoch = new Date(1899, 11, 30);

const formatDate = (value) => {
  let date;

  if (typeof value === 'number') {
    // Excel serial number → convert to JS Date
    date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
  } else {
    date = new Date(value);
  }

  // Digital format: YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const isDate = (value) => {
  return (
    (typeof value === 'string' && !isNaN(Date.parse(value))) ||
    typeof value === 'number'
  );
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {

  const url = `https://docs.google.com/spreadsheets/d/1BVQvDNtEVLU6zV2OpfFV-bs27xzz6bX8/export?format=xlsx&ts=${Date.now()}`; +
  Date.now();
        const rows = await fetchExcel(url);
        console.log('Fetched rows:', rows); // Debugging
        setData(rows);
      } catch (err) {
        console.error('Excel file load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  const [header, ...body] = data;

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.screenTitle}>Agriculture Matrix</Text>

      <ScrollView horizontal>
        <View>
          {/* Header Row */}
          <View style={[styles.row, styles.header]}>
            {header?.map((cell, i) => (
              <View key={i} style={styles.cell}>
                <Text style={[styles.text, styles.bold]}>{cell}</Text>
              </View>
            ))}
          </View>

          {/* Body Rows */}
          <ScrollView>
            {body.map((row, i) => (
              <View
                key={i}
                style={[
                  styles.row,
                  i % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
              >
                {row.map((cell, j) => (
                  <View key={j} style={styles.cell}>
                    <Text style={styles.text}>
                      {isDate(cell)
                        ? formatDate(cell)
                        : typeof cell === 'number'
                        ? Math.round(cell) // ✅ production kg as integer
                        : cell}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  row: { flexDirection: 'row' },
  cell: {
    width: 140,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { textAlign: 'center', fontSize: 14 },
  bold: { fontWeight: 'bold' },
  header: {
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 2,
    borderBottomColor: '#999',
  },
  rowEven: { backgroundColor: '#f2f2f2' },
  rowOdd: { backgroundColor: '#e6e6e6' },
});