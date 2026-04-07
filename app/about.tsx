import { ScrollView, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>About Divider</ThemedText>
          <ThemedText style={styles.subtitle}>Virtual Stock Trading Platform</ThemedText>
        </View>

        {/* Main Description */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>What is Divider?</ThemedText>
          <ThemedText style={styles.sectionText}>
            Divider is a virtual stock trading application that allows users to practice and learn stock market trading without risking real money. 
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Every user starts with a virtual wallet of <ThemedText style={styles.highlight}>$50,000</ThemedText> to trade stocks, build a diversified portfolio, and practice investment strategies.
          </ThemedText>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Key Features</ThemedText>
          <ThemedText style={styles.featureItem}>📊 Real-time stock data and market insights</ThemedText>
          <ThemedText style={styles.featureItem}>💰 Virtual $50,000 starting capital</ThemedText>
          <ThemedText style={styles.featureItem}>📈 Portfolio tracking and performance analysis</ThemedText>
          <ThemedText style={styles.featureItem}>🎯 Practice trading without financial risk</ThemedText>
          <ThemedText style={styles.featureItem}>🔐 Secure authentication and account management</ThemedText>
          <ThemedText style={styles.featureItem}>📱 Seamless iOS and Android experience</ThemedText>
        </View>

        {/* Who is it for */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Who is Divider For?</ThemedText>
          <ThemedText style={styles.sectionText}>
            Whether you're a beginner learning about stocks or an experienced investor looking to practice new strategies, Divider gives you the tools and virtual capital to succeed.
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Perfect for:
          </ThemedText>
          <ThemedText style={styles.featureItem}>🎓 Students learning about investing</ThemedText>
          <ThemedText style={styles.featureItem}>📚 Beginners practicing trading strategies</ThemedText>
          <ThemedText style={styles.featureItem}>💡 Experienced traders testing new approaches</ThemedText>
          <ThemedText style={styles.featureItem}>🤔 Anyone curious about the stock market</ThemedText>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>How It Works</ThemedText>
          <ThemedText style={styles.stepText}><ThemedText style={styles.bold}>1. Sign Up</ThemedText> - Create your account to get started</ThemedText>
          <ThemedText style={styles.stepText}><ThemedText style={styles.bold}>2. Receive Capital</ThemedText> - Get $50,000 in virtual funds</ThemedText>
          <ThemedText style={styles.stepText}><ThemedText style={styles.bold}>3. Start Trading</ThemedText> - Browse stocks and execute trades</ThemedText>
          <ThemedText style={styles.stepText}><ThemedText style={styles.bold}>4. Track Portfolio</ThemedText> - Monitor your investments in real-time</ThemedText>
          <ThemedText style={styles.stepText}><ThemedText style={styles.bold}>5. Learn & Grow</ThemedText> - Improve your investment skills risk-free</ThemedText>
        </View>

        {/* Technology */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Built With</ThemedText>
          <ThemedText style={styles.featureItem}>⚛️ React Native & Expo</ThemedText>
          <ThemedText style={styles.featureItem}>📘 TypeScript</ThemedText>
          <ThemedText style={styles.featureItem}>🏗️ Clean Architecture</ThemedText>
          <ThemedText style={styles.featureItem}>🔄 Real-time Market Data</ThemedText>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Version 1.0.0</ThemedText>
          <ThemedText style={styles.footerText}>© 2026 Divider. All rights reserved.</ThemedText>
          <ThemedText style={styles.footerText}>This project is private and confidential.</ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  highlight: {
    fontWeight: '700',
    fontSize: 15,
  },
  featureItem: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
});
