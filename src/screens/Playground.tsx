import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, GoogleIcon, Form, Hyperlink, Checkbox, AttendanceCard, AttendanceSummaryCard, NewsCard, DateCard, GuardianCard, PickupCard, SplashScreen } from '../components'
import { useSelectedDate, SelectedDateProvider } from '../hooks'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'

type PlaygroundNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'Playground'
>

export const Playground = () => {
  return (
    <SelectedDateProvider>
      <PlaygroundContent />
    </SelectedDateProvider>
  )
}

const PlaygroundContent = () => {
  const { selectedDate } = useSelectedDate()
  const navigation = useNavigation<PlaygroundNavigationProp>()
  const [shouldThrowError, setShouldThrowError] = React.useState(false)
  const [showSplash, setShowSplash] = React.useState(false)

  if (shouldThrowError) {
    throw new Error('This is a test error to trigger the error boundary!')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Component Playground</Text>
        <Text style={styles.subtitle}>Test your components here</Text>

        {/* Testing Area - Add your components below */}
        <View style={styles.testingArea}>
          {/* Splash Screen Testing */}
          <Text style={styles.sectionTitle}>Splash Screen Testing</Text>
          <Button
            label="Show Splash Screen"
            onPress={() => setShowSplash(true)}
            variant="secondary"
            size="large"
            icon={<Icon name="rocket" size={18} color="#371B34" />}
          />

          {/* Error Testing Buttons */}
          <Text style={styles.sectionTitle}>Error Fallback Testing</Text>
          <Button
            label="Throw Test Error"
            onPress={() => setShouldThrowError(true)}
            variant="primary"
            size="large"
            icon={<Icon name="bug" size={18} color="#FFF" />}
          />

          {/* Splash Screen Modal */}
          <Modal
            visible={showSplash}
            animationType="fade"
            onRequestClose={() => setShowSplash(false)}
          >
            <SplashScreen />
            <View style={{ position: 'absolute', top: 40, right: 20 }}>
              <Button
                label="Close"
                onPress={() => setShowSplash(false)}
                variant="secondary"
                size="small"
              />
            </View>
          </Modal>

          {/* Button with Google Icon */}
          <Text style={styles.sectionTitle}>Other Components</Text>
          <Button
            label="Sign in with Google"
            onPress={() => console.log('Google login pressed')}
            variant="primary"
            icon={<GoogleIcon size={20} />}
            iconPosition="left"
          />

          {/* Form Examples */}
          <Text style={styles.sectionTitle}>Form Components</Text>

          {/* Gradient Variant */}
          <Form
            label="Email Address"
            variant="gradient"
            placeholder="Enter your email"
            keyboardType="email-address"
            error="Invalid email address"
          />

          {/* Hyperlink Examples */}
          <Text style={styles.sectionTitle}>Hyperlink Components</Text>

          {/* Black Variant */}
          <Hyperlink
            text="Terms and Conditions"
            onPress={() => console.log('Terms pressed')}
            variant="black"
          />

          {/* Purple Variant */}
          <Hyperlink
            text="Forgot Password?"
            onPress={() => console.log('Forgot password pressed')}
            variant="purple"
          />

          {/* Checkbox Examples */}
          <Text style={styles.sectionTitle}>Checkbox Components</Text>

          {/* Checkbox with label */}
          <Checkbox
            label="I agree to the terms and conditions"
            onChange={(checked) => console.log('Checkbox changed:', checked)}
          />

          {/* Attendance Card Examples */}
          <Text style={styles.sectionTitle}>Attendance Card Components</Text>

          {/* Present status */}
          <AttendanceCard
            name="john doe"
            status="present"
            time="9:30 AM"
          />

          {/* Absent status */}
          <AttendanceCard
            name="jane smith"
            status="absent"
            time="10:15 AM"
          />

          {/* Pending status */}
          <AttendanceCard
            name="alex johnson"
            status="pending"
          />

          {/* Attendance Summary Card Examples */}
          <Text style={styles.sectionTitle}>Attendance Summary Card Components</Text>

          {/* Present summary */}
          <AttendanceSummaryCard
            variant="present"
            total={24}
          />

          {/* Absent summary */}
          <AttendanceSummaryCard
            variant="absent"
            total={6}
          />

          {/* News Card Examples */}
          <Text style={styles.sectionTitle}>News Card Components</Text>

          {/* Urgent tag */}
          <NewsCard
            tag="urgent"
            count={2}
            heading="School Closure Announcement"
            subheading="Important information regarding school closure next week"
          />

          {/* Important tag */}
          <NewsCard
            tag="important"
            count={5}
            heading="Parent-Teacher Meeting Schedule"
            subheading="Please check the updated schedule for the upcoming meetings"
          />

          {/* General tag */}
          <NewsCard
            tag="general"
            heading="New Library Books Available"
            subheading="Check out the latest additions to our school library"
          />

          {/* Date Card Examples */}
          <Text style={styles.sectionTitle}>Date Card Components</Text>
          <DateCard />
          <Text style={styles.selectedDateText}>
            Selected Date: {selectedDate.toDateString()}
          </Text>
          <Text style={styles.selectedDateText}>
            Formatted: {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>

          {/* Guardian Card Examples */}
          <Text style={styles.sectionTitle}>Guardian Card Components</Text>

          {/* Parent variant */}
          <GuardianCard
            name="Johan Bin Juzoh"
            relationship="Ibu"
            variant="parent"
            onPress={() => console.log('Parent card pressed')}
          />

          {/* Pickup person variant */}
          <GuardianCard
            name="Ahmad Bin Ali"
            relationship="Uncle"
            variant="pickup"
            onPress={() => console.log('Pickup person card pressed')}
          />

          {/* Pickup Card Examples */}
          <Text style={styles.sectionTitle}>Pickup Card Components</Text>

          {/* Parent variant */}
          <PickupCard
            name="Sarah Binti Ahmad"
            studentName="Ali Bin Hassan"
            variant="parent"
            pickupTime="Pick Up Time: 12:34"
            onPress={() => console.log('Parent pickup card pressed')}
          />

          {/* Pickup person variant */}
          <PickupCard
            name="Fatimah Binti Omar"
            studentName="Nurul Ain"
            variant="pickup"
            pickupTime="Pick Up Time: 15:45"
            onPress={() => console.log('Pickup person pickup card pressed')}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  testingArea: {
    gap: 16,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    fontWeight: '500',
  },
})
