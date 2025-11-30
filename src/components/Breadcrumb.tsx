import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, Typography, Spacing } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome'

interface BreadcrumbProps {
    steps: string[]
    currentStep: number
    onStepPress?: (index: number) => void
}

const Breadcrumb = ({ steps, currentStep, onStepPress }: BreadcrumbProps) => {
    return (
        <View style={styles.container}>
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <TouchableOpacity
                        style={styles.stepContainer}
                        onPress={() => onStepPress?.(index)}
                        disabled={!onStepPress || index > currentStep}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.stepCircle,
                                index === currentStep && styles.stepCircleActive,
                                index < currentStep && styles.stepCircleCompleted,
                            ]}
                        >
                            {index < currentStep ? (
                                <Icon name="check" size={14} color={Colors.white} />
                            ) : (
                                <Text
                                    style={[
                                        styles.stepNumber,
                                        index === currentStep && styles.stepNumberActive,
                                    ]}
                                >
                                    {index + 1}
                                </Text>
                            )}
                        </View>
                        <Text
                            style={[
                                styles.stepLabel,
                                index === currentStep && styles.stepLabelActive,
                                index < currentStep && styles.stepLabelCompleted,
                            ]}
                        >
                            {step}
                        </Text>
                    </TouchableOpacity>

                    {index < steps.length - 1 && (
                        <View
                            style={[
                                styles.connector,
                                index < currentStep && styles.connectorCompleted,
                            ]}
                        />
                    )}
                </React.Fragment>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
    },
    stepContainer: {
        alignItems: 'center',
        flex: 1,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.neutral[200],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    stepCircleActive: {
        backgroundColor: '#371B34',
    },
    stepCircleCompleted: {
        backgroundColor: '#4CAF50',
    },
    stepNumber: {
        fontSize: Typography.body.small.fontSize as number,
        fontWeight: Typography.label.medium.fontWeight as any,
        color: Colors.text.secondary,
    },
    stepNumberActive: {
        color: Colors.white,
    },
    stepLabel: {
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    stepLabelActive: {
        fontWeight: Typography.label.medium.fontWeight as any,
        color: Colors.text.primary,
    },
    stepLabelCompleted: {
        color: '#4CAF50',
    },
    connector: {
        height: 2,
        flex: 0.5,
        backgroundColor: Colors.neutral[200],
        marginBottom: 20,
    },
    connectorCompleted: {
        backgroundColor: '#4CAF50',
    },
})

export { Breadcrumb }
