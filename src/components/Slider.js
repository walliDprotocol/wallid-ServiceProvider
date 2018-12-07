import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const styles = {
  root: {
    width: 550,
  },
  slider: {
    padding: '22px 0px',
  }
};

const theme = createMuiTheme({
  overrides: {
    MuiSlider: {
      track: { backgroundColor: '#1a9fff', height: '6px', borderRadius: '8px' },
      thumb: { backgroundColor: '#1a9fff', height: '24px', width: '24px' },
      trackAfter: { backgroundColor: '#d8d8d8', opacity: 1 }
    },
  }
});

class StepSlider extends React.Component {
  state = {
    value: 15000,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <Slider
            classes={{ container: classes.slider }}
            value={value}
            min={0}
            max={50000}
            step={5000}
            onChange={this.handleChange}
          />
        </MuiThemeProvider>
        <input className="form-control slider-input" value={value} required/>
      </div>
    );
  }
}

StepSlider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StepSlider);
