import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, Avatar, StudentCard, StudentCardData } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'
import { collection, getDocs, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Student } from '../../types/Student'
import { Users } from '../../types/Users'

type ManageStudentsNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'TeacherManageStudents'
>

const ManageStudents = () => {
  const navigation = useNavigation<ManageStudentsNavigationProp>()
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState<StudentCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch students from Firestore
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true)
      const studentsRef = collection(db, 'students')
      const studentsSnapshot = await getDocs(studentsRef)

      const studentsData = await Promise.all(
        studentsSnapshot.docs.map(async (doc) => {
          const studentData = doc.data() as Student

          // Fetch guardian data
          let guardianName = 'Unknown'
          let guardianPhone = '-'
          let guardianHasAccount = false

          try {
            if (studentData.guardian) {
              const guardianDoc = await getDoc(studentData.guardian)
              if (guardianDoc.exists()) {
                const guardianData = guardianDoc.data() as Users
                guardianName = guardianData.name || 'Unknown'
                guardianPhone = guardianData.numphone || '-'
                guardianHasAccount = guardianData.registered || false
              }
            }
          } catch (error) {
            console.error('Error fetching guardian:', error)
          }

          return {
            id: doc.id,
            studentName: studentData.name,
            age: studentData.age,
            gender: studentData.gender,
            parentName: guardianName,
            parentPhone: guardianPhone,
            parentHasAccount: guardianHasAccount,
          } as StudentCardData
        })
      )

      setStudents(studentsData)
      console.log(`✅ Fetched ${studentsData.length} students`)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 ManageStudents screen focused - fetching students')
      fetchStudents()
    }, [fetchStudents])
  )

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const handleAddStudent = () => {
    navigation.navigate('TeacherAddStudentStep1Email')
  }

  const handleEditStudent = (studentId: string) => {
    navigation.navigate('TeacherEditStudent', { studentId })
  }

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase()
    return (
      student.studentName.toLowerCase().includes(query) ||
      student.parentName.toLowerCase().includes(query) ||
      student.parentPhone.includes(query)
    )
  })

  // Show only first 5 students
  const displayedStudents = filteredStudents.slice(0, 5)
  const hasMoreStudents = filteredStudents.length > 5

  const handleViewAllStudents = () => {
    navigation.navigate('TeacherAllStudents')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Icon name="graduation-cap" size={28} color={Colors.primary[600]} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.pageTitle}>Manage Students</Text>
            <Text style={styles.pageSubtitle}>
              {students.length} students registered
            </Text>
          </View>
        </View>

        {/* Add Student Button */}
        <Button
          label="Add New Student"
          onPress={handleAddStudent}
          icon={<Icon name="plus" size={18} color={Colors.white} />}
          variant="primary"
          size="large"
          fullWidth
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={18}
            color={Colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name, ID, parent name or phone..."
            placeholderTextColor={Colors.text.disabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Icon name="times-circle" size={18} color={Colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Students Count */}
        <View style={styles.countSection}>
          <Text style={styles.countText}>
            Showing {displayedStudents.length} of{' '}
            {filteredStudents.length} students
          </Text>
        </View>

        {/* Students List */}
        <View style={styles.studentsListSection}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#371B34" />
              <Text style={styles.loadingText}>Loading students...</Text>
            </View>
          ) : displayedStudents.length > 0 ? (
            <>
              {displayedStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onPress={handleEditStudent}
                />
              ))}

              {/* View All Link */}
              {hasMoreStudents && (
                <TouchableOpacity
                  style={styles.viewAllLink}
                  onPress={handleViewAllStudents}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllLinkText}>
                    View All {filteredStudents.length} Students
                  </Text>
                  <Icon name="arrow-right" size={14} color={Colors.primary[600]} />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search" size={64} color={Colors.text.disabled} />
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No students match "${searchQuery}"`
                  : 'No students registered yet'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  headerTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
  },
  pageSubtitle: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.black,
    padding: 0,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  countSection: {
    marginTop: Spacing.xs,
  },
  countText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  studentsListSection: {
    gap: Spacing.md,
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  viewAllLinkText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.primary[600],
    textDecorationLine: 'underline',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
  },
})

export { ManageStudents }
