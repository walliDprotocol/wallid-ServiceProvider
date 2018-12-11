import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import store from "./../js/store/index";
import { CREDIT_STATE } from "./../js/constants/action-types";

const styles = theme => ({
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

const theme = createMuiTheme({
  overrides: {
    MuiStepIcon: {
      root: {
        '&$completed': {
          color: '#1a9fff'
        },
        '&$active': {
          color: '#1a9fff'
        },
      }
    },
    MuiStepLabel: {
      label: {
        fontFamily: 'Source Sans Pro',
        fontSize: '14px',
        maxWidth: '120px',
        margin: '0px auto',
        color: '#164465',
        '&$active': {
          color: '#164465'
        }
      }
    }
  }
});

function getSteps() {
  return ['Funding purpose and values', 'Provide your identity information', 'Decrypt your data locally', 'Verifiy your data', 'Submit your application'];
}

function stepState() {
  switch (store.getState().creditState) {
    case CREDIT_STATE["CREDIT_STATE_PURPOSE_SELECT"]:
      return 0;

    case CREDIT_STATE["CREDIT_STATE_IDENTITY_SELECT"]:
      return 1;

    case CREDIT_STATE["CREDIT_STATE_LOAD_OPID"]:
      return 1;

    case CREDIT_STATE["CREDIT_STATE_LOAD_DATAID"]:
      return 1;

    case CREDIT_STATE["CREDIT_STATE_DECRYPT_DATA"]:
      return 2;

    case CREDIT_STATE["CREDIT_STATE_VERIFY_DATA"]:
      return 3;

    case CREDIT_STATE["CREDIT_STATE_VERIFY_DATAID"]:
      return 3;

    case CREDIT_STATE["CREDIT_STATE_SUBMIT_DATA"]:
      return 4;

    case CREDIT_STATE["CREDIT_STATE_FINISH"]:
      return 5;

    default:
      return 0;
  }
}

class HorizontalLabelPositionBelowStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: stepState()
    };
  }

  componentWillMount() {
    store.subscribe(() => {
      this.setState({
        activeStep: stepState()
      });
    });
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </MuiThemeProvider>
      </div>
    );
  }
}

HorizontalLabelPositionBelowStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(HorizontalLabelPositionBelowStepper);
