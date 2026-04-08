/**
 * ConsentModal – HIPAA privacy consent shown on first launch.
 * User must explicitly accept before any data is stored.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

export default function ConsentModal({ visible, onAccept, onDecline }) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onDecline}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('onboarding.step3Title')}</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.body}>{t('onboarding.step3Body')}</Text>

            <Text style={styles.sectionTitle}>What we store (on-device only)</Text>
            <Text style={styles.bullet}>• Mood check-ins</Text>
            <Text style={styles.bullet}>• Journal entries</Text>
            <Text style={styles.bullet}>• Your safety plan & trusted contacts</Text>
            <Text style={styles.bullet}>• App preferences (language, country)</Text>

            <Text style={styles.sectionTitle}>What we never do</Text>
            <Text style={styles.bullet}>• Never send your data to external servers</Text>
            <Text style={styles.bullet}>• Never sell or share your information</Text>
            <Text style={styles.bullet}>• Never log personally identifiable information</Text>
            <Text style={styles.bullet}>• Never require you to create an account</Text>

            <Text style={styles.sectionTitle}>HIPAA Safeguards</Text>
            <Text style={styles.bullet}>
              • All data encrypted using device Keychain (iOS) / Keystore (Android)
            </Text>
            <Text style={styles.bullet}>• Automatic session lock after inactivity</Text>
            <Text style={styles.bullet}>• You can delete all data at any time in Settings</Text>

            <Text style={styles.disclaimer}>{t('app.notTherapy')}</Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
            accessibilityRole="button"
          >
            <Text style={styles.acceptText}>{t('onboarding.step3Accept')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineButton}
            onPress={onDecline}
            accessibilityRole="button"
          >
            <Text style={styles.declineText}>{t('onboarding.step3Decline')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    maxHeight: '85%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.navyDeep,
    marginBottom: 16,
    textAlign: 'center',
  },
  scroll: {
    marginBottom: 16,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navyDeep,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bullet: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginLeft: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 18,
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 14,
  },
  acceptButton: {
    backgroundColor: Colors.navyDeep,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  acceptText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  declineButton: {
    alignItems: 'center',
    padding: 12,
  },
  declineText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
