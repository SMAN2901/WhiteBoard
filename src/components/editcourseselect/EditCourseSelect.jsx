import React, { Component } from "react";
import $ from "jquery";
import "./EditCourseSelect.css";

class EditCourseSelect extends Component {
    onSelect = index => {
        for (var i = 0; i < this.props.courses.length; i++) {
            if (i !== index) {
                const classes = ".select-course-list-item" + i.toString();
                $(classes).removeClass("select-course-list-item-selected");
            }
        }

        const classes = ".select-course-list-item" + index.toString();
        $(classes).addClass("select-course-list-item-selected");

        const selclasses = ".select-course-selectbox";
        $(selclasses).val(index);

        this.props.onSelect(index);
    };

    onChange = () => {
        const classes = ".select-course-selectbox";
        const index = $(classes).val();
        this.onSelect(index);
    };

    render() {
        const { courses } = this.props;

        return (
            <div className="select-course-container">
                <div className="select-course-selectbox-container">
                    <div className="select-course-selectbox-title">
                        <label>Select a course</label>
                    </div>
                    <select
                        className="select-course-selectbox"
                        onChange={this.onChange}
                    >
                        {courses.map((course, index) => (
                            <option key={course.course_id} value={index}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-course-list">
                    <div className="select-course-list-title">
                        <label>Select a course</label>
                    </div>
                    {courses.map((course, index) => (
                        <div
                            key={course.course_id}
                            className={
                                "select-course-list-item select-course-list-item" +
                                index.toString() +
                                (index > 0
                                    ? ""
                                    : " select-course-list-item-selected")
                            }
                            onClick={() => {
                                this.onSelect(index);
                            }}
                        >
                            <label className="select-course-list-label">
                                {course.title}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default EditCourseSelect;
