import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const timeframes = ['1 Min', '5 Min', '15 Min', '1 Hour'];

export default function ChartScreen() {
  const [selectedTF, setSelectedTF] = useState('1 Min');

  const chartData = {
    labels: ['10', '11', '12', '1', '2', '3'],
    datasets: [
      {
        data: [100, 105, 102, 108, 107, 111],
      },
    ],
  };

  const tableData = [
    { time: '14:40', open: 102.8, high: 103.5, low: 102.5, close: 103.1 },
    { time: '14:39', open: 102.5, high: 103.2, low: 102.3, close: 102.8 },
    { time: '14:38', open: 102.0, high: 103.8, low: 102.0, close: 103.2 },
    { time: '14:37', open: 102.5, high: 103.1, low: 102.4, close: 102.5 },
  ];

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>Analytics</Text>

      {/* TIMEFRAME */}
      <View style={styles.tfRow}>
        {timeframes.map(tf => (
          <TouchableOpacity
            key={tf}
            style={[
              styles.tfBtn,
              selectedTF === tf && styles.activeTF,
            ]}
            onPress={() => setSelectedTF(tf)}
          >
            <Text
              style={[
                styles.tfText,
                selectedTF === tf && { color: '#fff' },
              ]}
            >
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CHART */}
      <View style={styles.chartCard}>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={250}
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={false}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#3b5bdb',
            labelColor: () => '#999',
            strokeWidth: 2,
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* TABLE TITLE */}
      <Text style={styles.section}>Candle Data</Text>

      {/* TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Time</Text>
        <Text style={styles.cell}>Open</Text>
        <Text style={styles.cell}>High</Text>
        <Text style={styles.cell}>Low</Text>
        <Text style={styles.cell}>Close</Text>
      </View>

      {/* TABLE LIST */}
      <FlatList
        data={tableData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.rowItem}>
            <Text style={styles.cell}>{item.time}</Text>
            <Text style={styles.cell}>₹{item.open}</Text>
            <Text style={[styles.cell, { color: 'green' }]}>₹{item.high}</Text>
            <Text style={[styles.cell, { color: 'red' }]}>₹{item.low}</Text>
            <Text style={styles.cell}>₹{item.close}</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  tfRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  tfBtn: {
    padding: 8,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: '#eee',
  },

  activeTF: {
    backgroundColor: '#3b5bdb',
  },

  tfText: {
    fontSize: 12,
  },

  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
  },

  section: {
    fontWeight: 'bold',
    marginBottom: 8,
  },

  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },

  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 8,
  },

  cell: {
    fontSize: 12,
  },
});