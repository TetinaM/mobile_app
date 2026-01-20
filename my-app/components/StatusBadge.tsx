import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookStatus } from '../types/Book';

interface StatusBadgeProps {
  // Current status of the book (planned, reading, finished)
  status: BookStatus;
}

// Maps book status to specific theme colors
const STATUS_COLORS: Record<BookStatus, string> = {
  planned: '#FFA500',
  reading: '#1E90FF',
  finished: '#32CD32',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Get the appropriate background color for the badge
  const backgroundColor = STATUS_COLORS[status];

  return (
    /* Badge container with dynamic background color */
    <View style={[styles.badge, { backgroundColor }]}>
      {/* Uppercase status label */}
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