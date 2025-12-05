// src/styles/settings.js
import { StyleSheet } from 'react-native';

export const createSettingsStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,

        },

        header: {
            paddingTop: 20,
            paddingBottom: 30,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            backgroundColor: colors.background,
        },

        headerContent: {
            alignItems: 'center',
        },

        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 3,
            borderColor: colors.border,
        },

        userDetails: {
            marginLeft: 16,
            flex: 1,
        },

        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.titlewhite,
            marginBottom: 4,
        },

        userEmail: {
            fontSize: 16,
            color: colors.titlewhite,
            marginBottom: 8,
        },

        levelBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'green',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            alignSelf: 'flex-start',
        },

        levelText: {
            color: 'red',
            fontSize: 12,
            fontWeight: 'bold',
            marginLeft: 4,
        },

        scrollView: {
            flex: 1,
            marginTop: -20,
        },

        section: {
            marginBottom: 8,
            marginTop: 15,
        },
        settingsContainer: {
            flex: 1,
            paddingTop: 20,
            marginBottom: 60
        },

        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },

        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginLeft: 12,
        },

        sectionContent: {
            backgroundColor: colors.card,
        },

        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },

        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },

        settingIcon: {
            width: 40,
            height: 40,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            backgroundColor: colors.iconBackground,
        },

        settingInfo: {
            flex: 1,
        },

        settingLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.subtitle,
            marginBottom: 2,
        },

        settingDescription: {
            fontSize: 14,
            color: colors.subtitle,
        },

        settingRight: {
            marginLeft: 12,
        },

        selector: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        selectorText: {
            fontSize: 14,
            color: colors.subtitle,
            marginRight: 4,
        },

        actionSection: {
            padding: 20,
            marginTop: 20,
        },

        logoutButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'red',
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'red',
            marginBottom: 12,
        },

        logoutText: {
            fontSize: 16,
            fontWeight: '600',
            color: 'red',
            marginLeft: 8,
        },

        deleteButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },

        deleteText: {
            fontSize: 16,
            color: colors.text,
            marginLeft: 8,
        },

        // Modal
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: colors.transBlack,
        },

        modalContent: {
            backgroundColor: colors.card,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
            maxHeight: '90%',
        },

        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },

        modalTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },

        avatarSection: {
            alignItems: 'center',
            marginBottom: 20,
        },

        modalAvatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 12,
        },

        changePhotoButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
        },

        changePhotoText: {
            color: colors.title,
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 6,
        },

        form: {
            marginBottom: 20,
        },

        inputGroup: {
            marginBottom: 16,
        },

        inputLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
        },

        textInput: {
            backgroundColor: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: colors.text,
        },

        textArea: {
            height: 80,
            textAlignVertical: 'top',
        },

        modalActions: {
            flexDirection: 'row',
            gap: 12,
        },

        cancelButton: {
            flex: 1,
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },

        cancelButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },

        saveButton: {
            flex: 1,
            backgroundColor: colors.background,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
        },

        saveButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.title,
        },
    });
