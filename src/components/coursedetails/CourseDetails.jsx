import React, { Component } from "react";
import { getCourse, getLatestCourse } from "../../api/CoursesApi";

class CourseDetails extends Component {
    state = {};

    async componentDidMount() {
        const id = this.props.match.params.id;
        const course =
            id === "latest" ? await getLatestCourse() : await getCourse(id);

        this.setState({ course });
    }

    async componentDidUpdate() {
        //const id = this.props.match.params.id;
        //const course = await getCourse(id);
        //this.setState({ course });
    }

    render() {
        const { course } = this.state;
        const str = JSON.stringify(course, null, 4);
        return (
            <React.Fragment>
                <h1>Under Construction</h1>
                <p style={{ whiteSpace: "pre-wrap" }}>{str}</p>
            </React.Fragment>
        );
    }
}

export default CourseDetails;
