import React from 'react';
import {View, Text, Button} from 'react-native';
import {connect} from 'react-redux';
import {pokeFetch} from '../../store/action/poke';

const DummyLayout = ({navigation, pokeFetch, pokemon}) => {
  return (
    <View>
      <Text>Dummy</Text>
      <Button
        title="State Management"
        onPress={() => {
          console.warn('hello');
          pokeFetch();
        }}
      />
      <Text>status: {!pokemon.loading ? 'not loading' : 'loading'}</Text>
      <Text>error: {pokemon.errorMessage}</Text>
      <Text>{`data lenth: ${pokemon.data.length}`}</Text>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    pokemon: state.pokemon,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    pokeFetch: () => dispatch(pokeFetch()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DummyLayout);
