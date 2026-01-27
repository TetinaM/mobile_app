import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookStatus } from '../types/Book';

interface StatusBadgeProps {
  status: BookStatus;
}

const STATUS_COLORS: Record<BookStatus, string> = {
  planned: '#FFA500',
  reading: '#1E90FF',
  finished: '#32CD32',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const backgroundColor = STATUS_COLORS[status];

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default StatusBadge;