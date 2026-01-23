import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

/* ================= TYPES ================= */

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertButton {
  text: string;
  onPress: () => void;
  style?: 'primary' | 'secondary' | 'cancel';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  showIcon?: boolean;
  showCloseButton?: boolean;
  autoclose?: boolean;
  duration?: number;
  buttons?: AlertButton[];
  onClose: () => void;
}

/* ================= CONFIG ================= */

const ALERT_CONFIG: Record<
  AlertType,
  {
    color: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
  }
> = {
  success: {
    color: '#10b981', // Verde
    icon: 'check-circle',
    iconColor: '#10b981',
  },
  error: {
    color: '#ef4444', // Vermelho
    icon: 'error',
    iconColor: '#ef4444',
  },
  warning: {
    color: '#f59e0b', // Laranja
    icon: 'warning',
    iconColor: '#f59e0b',
  },
  info: {
    color: '#3b82f6', // Azul
    icon: 'info',
    iconColor: '#3b82f6',
  },
};

/* ================= COMPONENT ================= */

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  showIcon = true,
  showCloseButton = true,
  autoclose = false,
  duration = 3000,
  buttons = [],
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { color, icon, iconColor } = useMemo(() => ALERT_CONFIG[type], [type]);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const resetAnimation = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (visible) {
      animateIn();

      if (autoclose) {
        timerRef.current = setTimeout(onClose, duration);
      }
    } else {
      resetAnimation();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, autoclose, duration, animateIn, resetAnimation, onClose]);

  if (!visible) return null;

  const getButtonStyle = (btnStyle?: string) => {
    switch (btnStyle) {
      case 'primary':
        return {
          backgroundColor: color,
          borderColor: color,
        };
      case 'secondary':
        return {
          backgroundColor: '#f3f4f6',
          borderColor: '#d1d5db',
        };
      case 'cancel':
        return {
          backgroundColor: 'transparent',
          borderColor: '#d1d5db',
        };
      default:
        return {
          backgroundColor: color,
          borderColor: color,
        };
    }
  };

  const getButtonTextStyle = (btnStyle?: string) => {
    switch (btnStyle) {
      case 'primary':
        return { color: '#ffffff' };
      case 'secondary':
        return { color: '#374151' };
      case 'cancel':
        return { color: '#6b7280' };
      default:
        return { color: '#ffffff' };
    }
  };

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Barra colorida no topo */}
          <View style={[styles.topBar, { backgroundColor: color }]} />

          <View style={styles.contentContainer}>
            <View style={styles.header}>
              {showIcon && (
                <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                  <MaterialIcons
                    name={icon}
                    size={24}
                    color={iconColor}
                  />
                </View>
              )}

              <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>

              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons
                    name="close"
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              )}
            </View>

            {buttons.length > 0 ? (
              <View style={styles.buttonsContainer}>
                {buttons.map((btn, index) => (
                  <TouchableOpacity
                    key={`${btn.text}-${index}`}
                    style={[
                      styles.button,
                      getButtonStyle(btn.style),
                      buttons.length > 2 && styles.smallButton,
                    ]}
                    onPress={() => {
                      btn.onPress();
                      if (btn.style !== 'cancel') {
                        onClose();
                      }
                    }}
                  >
                    <Text style={[
                      styles.buttonText,
                      getButtonTextStyle(btn.style)
                    ]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.defaultButton, { backgroundColor: color }]}
                onPress={onClose}
              >
                <Text style={styles.defaultButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: width * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  topBar: {
    height: 4,
    width: '100%',
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  smallButton: {
    minWidth: 80,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  defaultButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  defaultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});