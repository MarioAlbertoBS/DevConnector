import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { editEducation, getCurrentProfile } from "../../actions/profile";

const EditEducation = ({ profile: { profile, loading }, editEducation, getCurrentProfile, history }) => {
  const [formData, setFormData] = useState({
    id: "",
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [toDateDisabled, toggleDIsabled] = useState(false);

  useEffect(() => {
    //Retrive experience from profile state
    getCurrentProfile();
    console.log(!loading ? profile : 'Empty');
    //Get index
    const index = window.location.pathname.split("/")[2];

    const education = loading || !profile.education[index] ? null : profile.education[index];
    
    //Disable to if current is true
    if (!loading && education.current) {
        toggleDIsabled(!toDateDisabled);
    }

    setFormData({
        id: loading || !education._id ? '' : education._id,
        school: loading || !education.school ? '' : education.school,
        degree: loading || !education.degree ? '' : education.degree,
        fieldofstudy: loading || !education.fieldofstudy ? '' : education.fieldofstudy,
        from: loading || !education.from ? '' : education.from.split('T')[0],
        to: loading || !education.to ? '' : education.to.split('T')[0],
        current: loading || !education.current ? false : education.current,
        description: loading || !education.description ? '' : education.description,
    });
  }, [loading]);

  const { school, degree, fieldofstudy, from, to, current, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section className="container">
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add Any school or bootcamp that you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => {
          e.preventDefault();
          editEducation(formData, formData.id, history);
      }}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            required
            value={school}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            required
            value={degree}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldofstudy"
            value={fieldofstudy}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              value=""
              checked={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                toggleDIsabled(!toDateDisabled);
              }}
            />{" "}
            Current School
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={(e) => onChange(e)}
            disabled={toDateDisabled ? 'disabled' : false}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </section>
  );
};

EditEducation.propTypes = {
  editEducation: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { editEducation, getCurrentProfile })(EditEducation);
