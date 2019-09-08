import {Text, View, TouchableHighlight, Slider, Image, TouchableOpacity, StyleSheet} from "react-native";
import Modal from 'react-native-modal'
import MapView, {PROVIDER_GOOGLE, Marker, Callout, AnimatedRegion} from 'react-native-maps';
import React from "react";
import {ToastAndroid} from 'react-native';

const MAX_DURATION = 9

export default class BookingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: "",
      startTimeIndex: 0,
      maxDuration: MAX_DURATION,
      duration: 1,
      modalVisible: false
    }
    this.startTimeData = []
    for (let i = 8; i < 13; ++i) {
      this.startTimeData.push(i + "am")
    }
    for (let i = 1; i < 5; ++i) {
      this.startTimeData.push(i + "pm")
    }
  }

  onStartTimeChange = (startTimeIndex) => {
    const {duration, maxDuration} = this.state
    const newMax = MAX_DURATION - startTimeIndex
    let _duration = duration
    if (duration === maxDuration) {
      _duration = newMax
    }
    this.setState({startTimeIndex, duration: _duration, maxDuration: newMax})
  }

  render() {
    const {modalVisible} = this.state
    console.log(modalVisible)
    return (
      <View style={styles.container}>
        <Image
          source={{uri: 'https://images.unsplash.com/photo-1523362612182-052e9ff2c8da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60'}}
          style={styles.image}/>
        <View style={styles.infoContainer}>
          <View>
            <Text>Address: 1 King st, Hobart, 7000</Text>
            <Text>Type: Shared</Text>
            <Text>Provided by: Jane Doe</Text>
            <Text>Price/hour: 1$</Text>
            <Text>Available Time: 8am-5pm</Text>
            <View style={styles.slider}>
              <Text style={styles.text}>{"Start: " + this.startTimeData[this.state.startTimeIndex]}</Text>
              <Slider
                step={1}
                maximumValue={this.startTimeData.length - 1}
                onValueChange={this.onStartTimeChange}
                minimumValue={0}
                value={0}
              />
            </View>
            <View style={styles.slider}>
              <Text style={styles.text}>{"Duration: " + this.state.duration + " hour(s)"}</Text>
              <Slider
                step={1}
                maximumValue={this.state.maxDuration}
                onValueChange={(duration) => this.setState({duration})}
                minimumValue={1}
                value={1}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={() => ToastAndroid.show('Your booking request has been sent', ToastAndroid.SHORT)}>
            <Text style={styles.buttonText}>Book</Text>
          </TouchableOpacity>
        </View>
        <Modal isVisible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.contentTitle}>Your Request has been sent!</Text>
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: false})}
                style={styles.closeButton}
              />
                <Text style={styles.buttonText}>
                  {'Close'}
                </Text>
            </View>
          </View>
        </Modal>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    width: '100%'
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },
  bookButton: {
    backgroundColor: '#e36912',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color:'#ffffff'
  },
  slider: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTextContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  closeButton: {
    width:'100%',
    backgroundColor: '#e36912',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
