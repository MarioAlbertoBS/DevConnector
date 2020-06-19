import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getCurrentProfile, editExperience } from "../../actions/profile";

const EditExperience = ({
  profile: { profile, loading },
  getCurrentProfile,
  editExperience,
  history,
  match
}) => {
  const [formData, setFormData] = useState({
    id: "",
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [toDateDisabled, toggleDIsabled] = useState(false);

  useEffect(() => {
    //Retrive experience from profile state
    getCurrentProfile();
    //Get object index from url
    const index = match.params.index;

    const experience = loading || !profile.experience[index] ? null : profile.experience[index];

    //Disable to if current is true
    if (!loading && experience.current) {
      toggleDIsabled(!toDateDisabled);
    }

    setFormData({
      id: loading || !experience._id ? "" : experience._id,
      company: loading || !experience.company ? "" : experience.company,
      title: loading || !experience.title ? "" : experience.title,
      location: loading || !experience.location ? "" : experience.location,
      from: loading || !experience.from ? "" : experience.from.split("T")[0],
      to: loading || !experience.to ? "" : experience.to.split("T")[0],
      current: loading || !experience.current ? false : experience.current,
      description: loading || !experience.description ? "" : experience.description,
    });
  }, [loading, getCurrentProfile, match]);

  const { company, title, location, from, to, current, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section className="container">
      <h1 className="large text-primary">Edit You Experience</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> You can update your experience
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          editExperience(formData, formData.id, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* Job Title"
            name="title"
            required
            value={title}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Company"
            name="company"
            required
            value={company}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
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
            Current Job
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={(e) => onChange(e)}
            disabled={toDateDisabled ? "disabled" : false}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
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

EditExperience.propTypes = {
  editExperience: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(mapStateToProps, { editExperience, getCurrentProfile })(
  EditExperience
);
