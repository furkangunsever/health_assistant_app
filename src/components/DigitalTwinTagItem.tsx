import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DigitalTwinTag} from '../types/digital-twin.types';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  SHADOW,
} from '../utils/theme';

interface DigitalTwinTagItemProps {
  tag: DigitalTwinTag;
  onDelete?: () => void;
}

const DigitalTwinTagItem: React.FC<DigitalTwinTagItemProps> = ({
  tag,
  onDelete,
}) => {
  const getStatusColor = () => {
    switch (tag.status) {
      case 'normal':
        return COLORS.success; // Tema success rengi
      case 'warning':
        return COLORS.warning; // Tema warning rengi
      case 'danger':
        return COLORS.error; // Tema error rengi
      default:
        return COLORS.success;
    }
  };

  const getStatusText = () => {
    switch (tag.status) {
      case 'normal':
        return 'Normal';
      case 'warning':
        return 'Dikkat';
      case 'danger':
        return 'Risk';
      default:
        return 'Normal';
    }
  };

  const getBodyPartText = () => {
    switch (tag.bodyPart) {
      case 'head':
        return '🧠 Baş';
      case 'chest':
        return '🫁 Göğüs';
      case 'arm':
        return '💪 Kol';
      case 'back':
        return '🔄 Sırt';
      case 'leg':
        return '🦵 Bacak';
      case 'neck':
        return '🦒 Boyun';
      case 'abdomen':
        return '🫃 Karın';
      case 'systemic':
        return '🌐 Sistemik';
      case 'full':
        return '👤 Genel';
      default:
        return '👤 Genel';
    }
  };

  return (
    <View style={[styles.container, {borderLeftColor: getStatusColor()}]}>
      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <Text style={styles.tagName}>{tag.name}</Text>
          <View
            style={[styles.statusBadge, {backgroundColor: getStatusColor()}]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.bodyPartText}>{getBodyPartText()}</Text>
          <Text style={styles.tagDate}>📅 {tag.date}</Text>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW.small,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.lightGray,
  },
  mainContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tagName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyPartText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    fontWeight: '500',
  },
  tagDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    opacity: 0.8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
    ...SHADOW.small,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
});

export default DigitalTwinTagItem;
