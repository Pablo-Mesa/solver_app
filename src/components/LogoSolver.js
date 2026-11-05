import { View, Image, StyleSheet } from 'react-native';

const LogoSolver = ({ size = 100 }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icono_solver_nobg.png')}                         
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    letterSpacing: 1,
  },
});

export default LogoSolver;
