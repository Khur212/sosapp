/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Fire from '../Fire';
import moment from 'moment';
import firebase from 'firebase';
//temporart data
posts = [
  {
    id: '1',
    name: 'Joe McKay',
    text: 'post yang pertama',
    timestamp: 1567282929393,
    avatar: require('../assets/Hima.jpg'),
    image: require('../assets/Group-2.png'),
  },
  {
    id: '2',
    name: 'Ahmad',
    text: 'post yang kedua',
    timestamp: 1567282929393,
    avatar: require('../assets/Hima.jpg'),
    image: require('../assets/Group-1.png'),
  },
  {
    id: '3',
    name: 'Lina',
    text: 'post yang ketiga',
    timestamp: 1567282929393,
    avatar: require('../assets/Hima.jpg'),
    image: require('../assets/Group-3.png'),
  },
];
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true,
      isloading: false,
    };
  }
  delete = (id, key) => {
    Alert.alert(
      'Konfirmasi',
      'Anda yakin ingin menghapus?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handle(id, key)},
      ],
      {cancelable: false},
      (handle = (i, k) => {
        firebase
          .database()
          .ref('posts/' + i + '/' + k)
          .remove();
        this.loadPost();
      }),
    );
  };
  loadPost = () => {
    var id = (firebase.auth().currentUser || {}).uid;
    try {
      firebase
        .database()
        .ref('posts/' + id)
        .on('value', snapshot => {
          var li = [];
          this.setState({list: [], isloading: true});
          snapshot.forEach(child => {
            li.push({
              key: child.key,
              image: child.val().image,
              timestamp: child.val().timestamp,
              text: child.val().text,
              uid: child.val().uid,
            });
          });
          console.log(this.state.list);
          this.setState({
            list: li,
            loading: false,
            isloading: false,
          });
        });
    } catch (err) {
      console.log('Error fetching data-----------', err);
    }
  };
  async componentDidMount() {
    this.loadPost();
  }
  componentWillUnmount() {
    this.setState({list: []});
  }
  renderPost = post => {
    return (
      <View style={styles.feedItem}>
        <Image source={require('../assets/Hima.jpg')} style={styles.avatar} />
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={styles.name}>Fatkhur Rohman</Text>
              <Text style={styles.timestamp}>
                {moment(post.timestamp).fromNow()}
              </Text>
            </View>
            <Icon name="dots-three-horizontal" size={24} color="#73788B" />
          </View>
          <Text style={styles.posts}>{post.text}</Text>
          <Image
            source={{uri: post.image}}
            style={styles.postImage}
            resizeMode="cover"
          />
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="thumbs-up"
              size={24}
              color="#737888"
              style={{marginRight: 16}}
            />
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Message', {
                  texdesc: post.text,
                  kunci: post.key,
                  img: post.image,
                })
              }>
              <Icon
                name="message"
                size={24}
                style={{marginRight: 16}}
                color="#737888"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.delete(post.uid, post.key)}>
              <Icon
                name="circle-with-cross"
                size={24}
                color="#737888"
                style={{marginRight: 16}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>
        <FlatList
          style={styles.feed}
          data={this.state.list}
          renderItem={({item}) => this.renderPost(item)}
          keyExtractor={item => item.key}
          showsVerticalScrollIndicator={false}
          onRefresh={this.loadPost}
          refreshing={this.state.isloading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFECF4',
  },
  header: {
    paddingTop: 45,
    paddingBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EBECF4',
    shadowColor: '#454D65',
    shadowOffset: {height: 5},
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#454d65',
  },
  timestamp: {
    fontSize: 11,
    color: '#C4C6CE',
    marginTop: 4,
  },
  posts: {
    marginTop: 16,
    fontSize: 14,
    color: '#838899',
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
});
