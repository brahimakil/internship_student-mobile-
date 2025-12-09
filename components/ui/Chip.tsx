import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const Chip = ({
  label,
  selected = false,
  onPress,
  onDelete,
  icon,
  style,
}: ChipProps) => {
  const { theme } = useTheme();

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          borderWidth: 1,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={selected ? theme.colors.surface : theme.colors.textPrimary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: selected ? theme.colors.surface : theme.colors.text,
          },
        ]}
      >
        {label}
      </Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons
            name="close-circle"
            size={16}
            color={selected ? theme.colors.surface : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    marginLeft: 4,
  },
});
