import React from 'react';
import { DANCER_NUM} from '../constants';
import { LIGHTPARTS } from '../constants';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

function LightEditor(props) {
    const [val, setVal] = React.useState(0);
    const handleSliderChange = (e, val) => {
        console.log("Slider Change", val);
        setVal(val);
    };
    const handleInputChange = (e) => {
        setVal(e.target.value === '' ? '' : Number(e.target.value));
        // cal mgr
    };
    const handleSliderCommit = (e, val) => {
        console.log("mouse up", val);
        // cal mgr
    }
    return (
        <div>
            <Typography id="input-slider" gutterBottom>
                {props.name}
            </Typography>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={6}>
                    <Slider
                        value={typeof val === 'number' ? val : 0}
                        aria-labelledby="input-slider"
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderCommit}
                        max={1}
                        min={0}
                        step={0.1}
                    />
                </Grid>
                <Grid>
                    <Input
                        value={val}
                        onChange={handleInputChange}
                        margin="dense"
                        inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 1,
                            type: 'number',
                            'aria-labelledby' : 'input-slider'
                        }}
                    />
                </Grid>

            </Grid>
        </div>
    );
}

class Editor extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            timeInd: props.timeInd,
            dancerId: 0,
        };
        this.handleChangeDancer = this.handleChangeDancer.bind(this);
        // setInterval(() => {
        //     console.log(this.state.timeInd)
        // }, 200);
    }
    handleChangeDancer(e) {
        this.setState({
            dancerId: e.target.value
        });
    }

    static getDerivedStateFromProps(props, state) {
        console.log(props, state);
        return null;
    }

    componentDidUpdate(prevProps) {
        console.log("component did update");
        console.log(this.props, prevProps);
    }

    render() {
        const dancerItems = [];
        for (let i = 0;i < DANCER_NUM; ++i) {
            dancerItems.push(<MenuItem value={i} key={i}>{i}</MenuItem>)
        }
        const lightParts = [];
        LIGHTPARTS.map(name => lightParts.push(<LightEditor name={name} key={name} />));
        return (
            <div>
                <InputLabel>Dancer ID</InputLabel>
                <Select value={this.state.dancerId} onChange={this.handleChangeDancer} style={{minWidth: '120px'}}>
                    {dancerItems}
                </Select>
                <hr />
                {lightParts}
            </div>
        )
    }
}

export default Editor
