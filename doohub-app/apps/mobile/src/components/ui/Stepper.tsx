import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderWidth } from '../../constants/theme';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * Stepper component matching wireframe "Step X of Y" indicator
 */
export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: borderWidth.default,
    borderBottomColor: colors.gray[200],
  },
  text: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
});

