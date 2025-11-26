import React, { useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  ViewStyle,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, BorderRadius, Spacing } from '../constants'

export type SliderVariant = 'primary' | 'secondary'

export interface SliderProps {
  label?: string
  onComplete?: () => void
  containerStyle?: ViewStyle
  variant?: SliderVariant
  popupTitle?: string
  popupDescription?: string
}

const VARIANT_COLORS = {
  primary: {
    backgroundColor: '#D4F4DD',
    sliderColor: '#62B76F',
    completeColor: '#4CAF50',
    textColor: '#000',
  },
  secondary: {
    backgroundColor: '#E3F2FD',
    sliderColor: '#42A5F5',
    completeColor: '#1976D2',
    textColor: '#000',
  },
}

export const Slider: React.FC<SliderProps> = ({
  label = "I've Arrived",
  onComplete,
  containerStyle,
  variant = 'primary',
  popupTitle = 'Success!',
  popupDescription = 'Action completed successfully.',
}) => {
  const colors = VARIANT_COLORS[variant]
  const [showModal, setShowModal] = useState(false)

  const SLIDER_HEIGHT = 50
  const BUTTON_SIZE = 42
  const [sliderWidth, setSliderWidth] = React.useState(250)
  const SLIDE_DISTANCE = sliderWidth - BUTTON_SIZE - 8

  const pan = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(1)).current

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const slideDistance = sliderWidth - BUTTON_SIZE - 8
        if (gestureState.dx >= 0 && gestureState.dx <= slideDistance) {
          pan.setValue(gestureState.dx)
          // Fade out text as slider moves
          const newOpacity = 1 - gestureState.dx / slideDistance
          opacity.setValue(newOpacity)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const slideDistance = sliderWidth - BUTTON_SIZE - 8
        if (gestureState.dx >= slideDistance * 0.9) {
          // Complete the slide
          Animated.timing(pan, {
            toValue: slideDistance,
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            onComplete?.()
            setShowModal(true)
            // Reset slider
            setTimeout(() => {
              Animated.parallel([
                Animated.timing(pan, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }),
              ]).start()
            }, 300)
          })
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: false,
              tension: 40,
              friction: 8,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start()
        }
      },
    })
  ).current

  const backgroundInterpolation = pan.interpolate({
    inputRange: [0, SLIDE_DISTANCE],
    outputRange: [colors.backgroundColor, colors.completeColor],
  })

  // Interpolate arrow icon based on position
  const progress = pan.interpolate({
    inputRange: [0, SLIDE_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  return (
    <>
      <View
        style={[styles.wrapper, containerStyle]}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout
          setSliderWidth(width)
        }}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: backgroundInterpolation,
              width: '100%',
              height: SLIDER_HEIGHT,
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.label,
              {
                color: colors.textColor,
                opacity: opacity,
              },
            ]}
          >
            {label}
          </Animated.Text>

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.slider,
              {
                backgroundColor: colors.sliderColor,
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                transform: [{ translateX: pan }],
              },
            ]}
          >
            <Animated.View style={styles.arrowContainer}>
              {/* Show different arrow icons based on progress */}
              <Animated.View
                style={{
                  opacity: progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0, 0],
                  }),
                  position: 'absolute',
                }}
              >
                <Icon name="chevron-right" size={20} color={Colors.white} />
              </Animated.View>

              <Animated.View
                style={{
                  opacity: progress.interpolate({
                    inputRange: [0, 0.5, 0.9, 1],
                    outputRange: [0, 1, 0, 0],
                  }),
                  position: 'absolute',
                }}
              >
                <Icon name="angle-double-right" size={20} color={Colors.white} />
              </Animated.View>

              <Animated.View
                style={{
                  opacity: progress.interpolate({
                    inputRange: [0, 0.9, 1],
                    outputRange: [0, 0, 1],
                  }),
                  position: 'absolute',
                }}
              >
                <Icon name="check" size={20} color={Colors.white} />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" size={60} color={colors.completeColor} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>{popupTitle}</Text>
            <Text style={styles.modalDescription}>{popupDescription}</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.completeColor }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    padding: 4,
    position: 'relative',
  },
  label: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  slider: {
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalIcon: {
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight as any,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalDescription: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  closeButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '600',
    color: Colors.white,
  },
})
