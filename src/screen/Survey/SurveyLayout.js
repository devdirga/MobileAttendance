import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    StyleSheet,
    StatusBar,
    Linking
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const SurveyLayoutLayout = ({
    user,
    route,
    navigation,
    activitySetLoading,
}) => {
    const Item = ({ title }) => (
        <View style={styles.item}>
            <FontAwesome5 name="poll-h" size={20} color="#f59a22" />
            <Text
                style={{ color: '#fff', paddingLeft: 10, flex: 1 }}
                onPress={() => { Linking.openURL(title.surveyUrl) }}>
                {title.title}
            </Text>
        </View>
    );
    const renderItem = ({ item }) => (
        <Item title={item} />
    );
    return (
        <>
            <View style={{ backgroundColor: '#0097D1' }}>
                <SafeAreaView>
                    <FlatList
                        data={route.params.location}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#0097D1',
        padding: 5,
        color: '#fff',
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row'
    },
    title: {
        fontSize: 32,
    },
});

export default SurveyLayoutLayout;