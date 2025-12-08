import React, { useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, StudentCard } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { mockStudentsWithParents } from '../../data/MockStudentParent'
import Icon from 'react-native-vector-icons/FontAwesome'

type AllStudentsNavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'TeacherAllStudents'
>

const AllStudents = () => {
    const navigation = useNavigation<AllStudentsNavigationProp>()
    const [searchQuery, setSearchQuery] = useState('')

    const handleAvatarPress = () => {
        navigation.navigate('TeacherProfile')
    }

    const handleEditStudent = (studentId: number) => {
        navigation.navigate('TeacherEditStudent', { studentId: studentId.toString() })
    }

    // Filter students based on search query
    const filteredStudents = mockStudentsWithParents.filter((student) => {
        const query = searchQuery.toLowerCase()
        return (
            student.studentName.toLowerCase().includes(query) ||
            student.studentId.toLowerCase().includes(query) ||
            student.parentName.toLowerCase().includes(query) ||
            student.parentPhone.includes(query)
        )
    })

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
                        <Text style={styles.pageTitle}>All Students</Text>
                        <Text style={styles.pageSubtitle}>
                            Complete list of all students
                        </Text>
                    </View>
                </View>

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
                        Showing {filteredStudents.length} of{' '}
                        {mockStudentsWithParents.length} students
                    </Text>
                </View>

                {/* Students List */}
                <View style={styles.studentsListSection}>
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onPress={() => handleEditStudent(student.id)}
                            />
                        ))
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
})

export { AllStudents }
