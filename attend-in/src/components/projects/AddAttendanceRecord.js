import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkIn } from '../../store/actions/studentActions'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'


class AddAttendanceRecord extends Component {

  state = {
    courseId: this.props.location.pathname.split('/')[2], // doing this made me want to throw up
    studentId: this.props.auth.uid
  }

  handleChange = (e) => {
    this.setState({
      courseId: e.target.value
    })
  }

  handleSubmit = (e) => {
    var validate = false
    
    console.log('this.state',this.state)
    console.log('this.props',this.props)
    navigator.geolocation.getCurrentPosition(success)
   
   debugger
    var x = 0
    while (x < 100) {
      console.log(x)
      x++
    }
    var lat = 0
    var lon = 0
    var state = this.state
    var props =  this.props

    function success(pos) {
      
      var crd = pos.coords;

        // GEO LOCATION
        // spoof to say that im in subway across from aderhold
        //    33.7559823631736, -84.38939413520089 

        //aderhold is 
        // 33.756230957146805, -84.38931751762408

        // smoothie king  33.75609609410136, -84.3891822407182 to far

        // across street 33.75617081890874, -84.38954701782512 to far

        // in class 33.75618414926428, -84.38937045787564


        //DOES NOT WORK
        //lat = 33.75609609410136
        //lon = -84.3891822407182

        //WORKS
        lat = 33.75618414926428
        lon = -84.38937045787564

        //props.checkIn(state)

        console.log(props)
        console.log(props.courses)

        console.log(props.courses)
        console.log(props.courses.courseLocation._lat)

        var dis = distance( lat, lon, props.courses.courseLocation._lat, props.courses.courseLocation._long, 'M' )
        
      // distance from subway 0.015397032419328946 .. not close enough
      // distance from smoothie king 0.010535947606981136 .. not close enough
      // 0.01 Mile = 16.09344 meters which seems ish lol we will take that for now.. 

             
        var x = 0
        while (x < 100) {
          console.log(x)
          x++
        }
       if ( dis < .010 ) {
        props.checkIn(state)

        var x = 0
        while (x < 100) {
          console.log(x)
          x++
        }

        e.preventDefault();
        validate = true
        window.location.pathname = 'attendanceSuccess'
        props.history.push('/attendanceSuccess');
       }
       else {
         alert('Not in class - Error Code: ' + dis )
       }


      }

    function distance(lat1, lon1, lat2, lon2, unit) {
      console.log(lat1)
      console.log(lon1)
      console.log('Initial')
      console.log(lat2)
      console.log(lon2)
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="M") { dist = dist * 0.8684 }
      return dist
    }

    if (validate)
      this.props.history.push('/attendanceSuccess');

  }
  render() {

    const { auth } = this.props;

    if (!auth.uid) return <Redirect to='/signin' />
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Attendance</h5>
          <div className="input-field">
            <button className="glow-on-hover">CHECK IN</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  var id = window.location.pathname.split('/')[2]

  var x = state.firestore.ordered.courses

  if( !! x && x.length > 0 ) {
    for (let index = 0; index < x.length; index++) {
     if ( x[index].id == id )
     state.firestore.ordered.courses = x[index] 
    }
  }

  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    courses: state.firestore.ordered.courses
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkIn: (course) => dispatch(checkIn(course)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{
    collection: 'courses'
  }])
)(AddAttendanceRecord)
