import React from 'react';
import { Alert, Button, Text, View } from 'react-native';

const PremiumScreen = () => {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text >Premium</Text>
            <Text style={{ marginTop: 12 }}>Remover anúncios, aulas avançadas e certificado.</Text>
            <View style={{ marginTop: 12 }}>
                <Button title="Comprar Premium (placeholder)" onPress={() => Alert.alert('Pagamento', 'Implementar In-App Purchases via EAS / Stripe / Play Billing')} />
            </View>
        </View>
    );
}

const styles = {
    h2: {

        fontWeight: 'bold'
    },
};
export default PremiumScreen;