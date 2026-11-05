import { View, Text, StyleSheet } from 'react-native';
import LogoSolver from "../../components/LogoSolver";

export const Header = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.container_icono_title}>
        <LogoSolver size={32} />
        <View style={styles.container_titles}>  
          <Text style={styles.text}>{props.name_screen}</Text>
          <Text style={styles.text_secundary}>Desarrollo de solucciones</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container_icono_title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 1,
  },
  container_titles: {
    flexDirection: 'col',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },  
  text: {
    color: '#444',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
    padding: 0,
    margin: 0,
  },  
  text_secundary: {
    color: '#666',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 0,
    margin: 0,
    marginBottom: 2,
  },
});

export default Header;