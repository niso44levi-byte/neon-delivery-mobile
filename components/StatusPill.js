// components/StatusPill.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusPill({ status }) {
  const map = {
    pending:   { color: '#f5a623', label: 'ממתין לשליח' },
    in_transit:{ color: '#007aff', label: 'בדרך' },
    delivered: { color: '#28a745', label: 'נמסר' },
  };
  const s = map[status] ?? { color: '#999', label: 'לא ידוע' };

  return (
    <View style={[styles.pill, { borderColor: s.color }]}>
      <Text style={[styles.text, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  text: { fontWeight: '600' },
});
