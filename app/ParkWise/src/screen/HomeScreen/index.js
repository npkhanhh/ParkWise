import {Text, View, StyleSheet, TextInput} from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker, Callout, AnimatedRegion} from 'react-native-maps';
import React from "react";
import ClusteredMapView from "react-native-maps-super-cluster";
import CustomCallout from "./CustomCallout";


const PARKING_TYPE = ['shared', 'private', 'public']
const PARKING_TYPE_TO_COLOR = {'public': 'red', 'private': 'purple', 'shared': 'green'}

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      destination: "",
      data: [],
    }
    this.region = {
      latitude: -42.8847743,
      longitude: 147.3239927,
      latitudeDelta: 0.0522,
      longitudeDelta: 0.0521,
    }
    this.lock = false;
    this.isDragged = true;
  }

  componentDidMount = () => {
    fetch('http://35.198.227.72/parking').then((response) => response.json()).then((responseJson) => this.setState({data:responseJson}))
  }

  onChangeText = (destination) => {
    this.setState({destination})
  }

  onSubmit = () => {
    const {destination, region} = this.state
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + destination + '&key=xxxx')
      .then((response) => response.json())
      .then((responseJson) => {
        const geometry = responseJson['results'][0]['geometry']
        const location = geometry['location']
        const northeast = geometry['viewport']['northeast']
        const _region = {
          latitude: location['lat'],
          longitude: location['lng'],
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0221,
        }
        setTimeout(() =>
          this.map.mapview.animateToRegion(_region), 10);
      })
  }

  onRegionChange = (region) => {
    if (!this.lock && this.isDragged) {
      this.lock = true;
      setTimeout(() => {
        this.setState({region});
        this.lock = false;
      }, 100);
    }
  }

  onRegionChangeComplete = (region) => {
    this.setState({region})
    // const data = []
    // const {latitude, longitude} = this.state
    // for (let i = 0; i < no; ++i) {
    //   let marker = {
    //     coordinate: {
    //       latitude: latitude + Math.random() * 0.02 - 0.01,
    //       longitude: longitude + Math.random() * 0.02 - 0.01
    //     },
    //     price: Math.round((Math.random() * (10 - 2.5) + 2.5) * 2) / 2,
    //     type: PARKING_TYPE[Math.floor(Math.random() * PARKING_TYPE.length)]
    //   }
    //   data.push(marker)
    // }
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId

    // use pointCount to calculate cluster size scaling
    // and apply it to "style" prop below

    // eventually get clustered points by using
    // underlying SuperCluster instance
    // Methods ref: https://github.com/mapbox/supercluster
    const clusteringEngine = this.map.getClusteringEngine(),
      clusteredPoints = clusteringEngine.getLeaves(clusterId, 100)

    return (
      <Marker coordinate={coordinate} onPress={onPress}>
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>
            {pointCount}
          </Text>
        </View>
        {
          /*
            Eventually use <Callout /> to
            show clustered point thumbs, i.e.:
            <Callout>
              <ScrollView>
                {
                  clusteredPoints.map(p => (
                    <Image source={p.image}>
                  ))
                }
              </ScrollView>
            </Callout>

            IMPORTANT: be aware that Marker's onPress event isn't really consistent when using Callout.
           */
        }
      </Marker>
    )
  }

  renderMarker = (data) =>
    <Marker key={data.id || Math.random()} coordinate={data.coordinate} pinColor={PARKING_TYPE_TO_COLOR[data.type]}>
      <CustomCallout
        {...data}
        navigation={this.props.navigation}
      />
    </Marker>

  render() {
    const {data} = this.state
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmit}
        />
        <ClusteredMapView
          style={styles.map}
          data={data}
          initialRegion={this.region}
          ref={(r) => {
            this.map = r
          }}
          renderMarker={this.renderMarker}
          renderCluster={this.renderCluster}
          provider={PROVIDER_GOOGLE}
          accessor={"coordinate"}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  textInput: {
    position: 'absolute',
    alignSelf: 'center',
    width: '75%',
    zIndex: 99,
    backgroundColor: '#ffffff',
    top: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  clusterContainer: {
    width: 30,
    height: 30,
    padding: 6,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#4d65f0',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  clusterText: {
    fontSize: 13,
    color: '#4d65f0',
    fontWeight: '500',
    textAlign: 'center',
  },
  plainView: {
    width: 60,
  },
});