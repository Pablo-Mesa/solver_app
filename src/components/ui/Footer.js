import { View, Text, StyleSheet } from 'react-native';
export const Footer = () => {
  return (
    <View style={styles.container}>      
      <Text style={styles.text}>© 2026 Mi Aplicación</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E5E5EA',
  },
  text: {
    color: '#8E8E93',
    fontSize: 12,
  },
});

export default Footer;