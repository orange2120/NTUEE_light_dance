import React from 'react';
import { LIGHTPARTS } from '../constants';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.mgr);
    }
    render() {
        return (
        <div>
            <h3>
            Hello to editor with React
            </h3>
        </div>
        )
    }
}

export default Editor
