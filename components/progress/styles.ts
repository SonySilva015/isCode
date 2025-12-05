import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        height: 10,
        backgroundColor: '#eee',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10
    },
    progress: {
        height: '100%',
    },
    textProgressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    textProgress: {
        marginTop: 5,
        fontSize: 12,
        color: '#555',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 10,
        borderRadius: 20
    },
    txtPerc: {
        color: 'rgb(216, 26, 233)',
        fontWeight: 'bold'
    }

});
