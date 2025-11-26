import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Form, Button } from '../components'
import { Typography, Colors, Spacing } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../navigation/type'

type AddPickupPersonNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'AddPickupPerson'>

const AddPickupPerson = () => {
  const navigation = useNavigation<AddPickupPersonNavigationProp>()
  return (
    <SafeAreaView style={styles.container}>
        <Header showBackButton={true}/>
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
        <Text style={styles.dashboardTitle}>Add New Pick Up Person</Text>

        <View style={styles.pickupBox}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <Form
                label="First Name"
                variant="simple"
                placeholder="Enter first name"
                keyboardType="default"
            />
            <Form
                label="Last Name"
                variant="simple"
                placeholder="Enter last name"
                keyboardType="default"
            />
            <Form
                label="Phone Number"
                variant="simple"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
            />
            <Form
                label="Relationship"
                variant="simple"
                placeholder="Enter relationship"
                keyboardType="default"
            />
        </View>

        <View style={styles.buttonContainer}>
            <View style={styles.primaryButtonWrapper}>
                <Button
                    label="Save Profile"
                    onPress={() => console.log('Save pickup person')}
                    variant="primary"
                />
            </View>
            <View style={styles.secondaryButtonWrapper}>
                <Button
                    label="Clear All"
                    onPress={() => navigation.goBack()}
                    variant="secondary"
                />
            </View>
      </View>

        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent:{
        padding: 16,
        gap: Spacing.md,
    },
    dashboardTitle: {
        fontSize: Typography.heading.h1.fontSize as number,
        fontWeight: Typography.heading.h1.fontWeight as any,
        color: Colors.black,
        marginBottom: Spacing.md,
    },
    pickupBox: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: Spacing.lg,
        gap: Spacing.md,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BDBDBD',
    },
    sectionTitle: {
        fontSize: Typography.heading.h3.fontSize as number,
        fontWeight: Typography.heading.h3.fontWeight as any,
        color: Colors.black,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    primaryButtonWrapper: {
        flex: 2,
    },
    secondaryButtonWrapper: {
        flex: 1,
    },
})

export {AddPickupPerson}