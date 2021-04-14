import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addStudentCourse } from '../../store/actions/courseActions'
import { addTeacherCourse } from '../../store/actions/courseActions'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import checkIcon from './assets/check.svg';
import errorIcon from './assets/error.svg';
import infoIcon from './assets/info.svg';
import warningIcon from './assets/warning.svg';
import Toast from './components/toast/Toast';
import PropTypes from 'prop-types';

class AddCourse extends Component {
  state = {
    courseId: '',
    studentId: this.props.auth.uid
  }
 const testList = [
    {
      id: 1,
      title: 'Success',
      description: 'Course added',
      backgroundColor: '#5cb85c',
      icon: checkIcon
    },
    {
      id: 2,
      title: 'Duplicate',
      description: 'You have already added this course',
      backgroundColor: '#d9534f',
      icon: warningIcon
    },
        {
      id: 3,
      title: 'Error',
      description: 'You have entered an invalid course ID',
      backgroundColor: '#d9534f',
      icon: errorIcon
    }
];
  handleChange = (e) => {
    this.setState({
      courseId: e.target.value
    })
  }
  handleSubmit = () => {
    console.log(this.state.courseId)
    console.log(this.props.profile.role.toLowerCase() )
    firebase.firestore().collection("courses").where("code", "==", this.state.courseId)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.setState({courseId : doc.id})
           if( this.props.profile.role.toLowerCase() === 'student' )
            this.props.addStudentCourse(this.state);
          if( this.props.profile.role.toLowerCase() === 'teacher' )
            this.props.addTeacherCourse(this.state);
          })
      })
    e.preventDefault();
   this.props.history.push('/add');
  }
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <
        Redirect to='/signin' />
    return (
      <div className="container">           
            <div className="app-header">
    </div>
    
            <form className="white" onSubmit={this.handleSubmit}>  
            <h5 className="grey-text text-darken-3">Add Course</h5>
          
            <div className="input-field">
            <input type="text" id='title' onChange={this.handleChange} />
            <label htmlFor="courseId">Course Code</label>
          
            </div>
          
            <div className="input-field">
            <button className="btn pink lighten-1">Add</button>
          
            </div>
        
            </form>
                    
            <Toast 
        toastList={list}
        position={position}
        autoDelete={checkValue}
        autoDeleteTime={autoDeleteTime}
      />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addStudentCourse: (course) => dispatch(addStudentCourse(course)),
    addTeacherCourse: (course) => dispatch(addTeacherCourse(course))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCourse)