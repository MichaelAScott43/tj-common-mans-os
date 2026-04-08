/**
 * OnboardingScreen – first-run setup wizard.
 *
 * Step 1: Language selection
 * Step 2: Veteran mode toggle + country selection
 * Step 3: HIPAA privacy consent
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n, { SupportedLanguages } from '../i18n';
import { CountryList } from '../constants/crisis';
import { Colors } from '../constants/colors';
import { savePrefs, loadPrefs, KEYS, saveSecure } from '../utils/secureStorage';
import ConsentModal from '../components/ConsentModal';
import BrandLogo from '../components/BrandLogo';

export default function OnboardingScreen({ navigation }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState(i18n.language);
  const [country, setCountry] = useState('US');
  const [veteranMode, setVeteranMode] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  function selectLanguage(code) {
    setLanguage(code);
    i18n.changeLanguage(code);
  }

  async function handleAccept() {
    setShowConsent(false);
    const existing = await loadPrefs();
    await savePrefs({
      ...existing,
      language,
      country,
      veteranMode,
      onboardingDone: true,
      consentGiven: true,
    });
    await saveSecure(KEYS.CONSENT_GIVEN, { date: new Date().toISOString() });
    await saveSecure(KEYS.ONBOARDING_DONE, true);
    navigation.replace('Main');
  }

  function handleDecline() {
    setShowConsent(false);
    // Decline is non-destructive — user stays on onboarding
  }

  function nextStep() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowConsent(true);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.navyDeep} />

      {/* Header */}
      <View style={styles.header}>
        <BrandLogo size="small" light showBrand={false} />
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={[styles.dot, step >= n && styles.dotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* ── Step 1: Language ── */}
        {step === 1 && (
          <>
            <Text style={styles.stepTitle}>{t('onboarding.step1Title')}</Text>
            <Text style={styles.stepSub}>{t('onboarding.step1Subtitle')}</Text>
            {SupportedLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.option, language === lang.code && styles.optionSelected]}
                onPress={() => selectLanguage(lang.code)}
              >
                <Text
                  style={[
                    styles.optionText,
                    language === lang.code && styles.optionTextSelected,
                  ]}
                >
                  {lang.label}
                </Text>
                {language === lang.code && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ── Step 2: Country + Veteran ── */}
        {step === 2 && (
          <>
            <Text style={styles.stepTitle}>{t('onboarding.selectCountry')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.countryRow}
              style={styles.countryScroll}
            >
              {CountryList.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.countryChip, country === c.code && styles.chipSelected]}
                  onPress={() => setCountry(c.code)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      country === c.code && styles.chipTextSelected,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.stepTitle, { marginTop: 28 }]}>
              {t('onboarding.step2Title')}
            </Text>
            <Text style={styles.stepSub}>{t('onboarding.step2Subtitle')}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.option, styles.optionHalf, veteranMode && styles.optionSelected]}
                onPress={() => setVeteranMode(true)}
              >
                <Text style={[styles.optionText, veteranMode && styles.optionTextSelected]}>
                  🎖 {t('onboarding.step2Yes')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, styles.optionHalf, !veteranMode && styles.optionSelected]}
                onPress={() => setVeteranMode(false)}
              >
                <Text style={[styles.optionText, !veteranMode && styles.optionTextSelected]}>
                  {t('onboarding.step2No')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── Step 3: Privacy preview ── */}
        {step === 3 && (
          <>
            <Text style={styles.stepTitle}>{t('onboarding.step3Title')}</Text>
            <Text style={styles.stepBody}>{t('onboarding.step3Body')}</Text>
            <View style={styles.privacyHighlights}>
              {[
                '🔒  All data stays on your device',
                '🚫  No accounts required',
                '🗑️  Delete everything, anytime',
                '🔐  Encrypted storage (Keychain / Keystore)',
              ].map((item) => (
                <Text key={item} style={styles.privacyItem}>
                  {item}
                </Text>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.backBtnText}>{t('common.back')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
          <Text style={styles.nextBtnText}>
            {step < 3 ? t('common.next') : t('onboarding.step3Accept')}
          </Text>
        </TouchableOpacity>
      </View>

      <ConsentModal
        visible={showConsent}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navyDeep },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 10 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.navyMid, opacity: 0.4 },
  dotActive: { backgroundColor: Colors.tealLight, opacity: 1 },
  body: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: Colors.textLight, marginBottom: 8 },
  stepSub: { fontSize: 14, color: Colors.textLight, opacity: 0.7, marginBottom: 20, lineHeight: 20 },
  stepBody: { fontSize: 14, color: Colors.textLight, opacity: 0.8, lineHeight: 22, marginBottom: 20 },
  option: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: { borderColor: Colors.tealLight, backgroundColor: 'rgba(62,175,175,0.15)' },
  optionText: { fontSize: 16, color: Colors.textLight, fontWeight: '500' },
  optionTextSelected: { color: Colors.tealLight, fontWeight: '700' },
  checkmark: { color: Colors.tealLight, fontSize: 18, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10 },
  optionHalf: { flex: 1, justifyContent: 'center' },
  countryScroll: { marginBottom: 8 },
  countryRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  countryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: { borderColor: Colors.tealLight, backgroundColor: 'rgba(62,175,175,0.2)' },
  chipText: { color: Colors.textLight, fontSize: 13, opacity: 0.8 },
  chipTextSelected: { color: Colors.tealLight, fontWeight: '700', opacity: 1 },
  privacyHighlights: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  privacyItem: { color: Colors.textLight, fontSize: 14, lineHeight: 22 },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 10,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: Colors.teal,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  nextBtnText: { color: Colors.textLight, fontSize: 16, fontWeight: '700' },
  backBtn: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: { color: Colors.textLight, fontSize: 14, opacity: 0.7 },
});
