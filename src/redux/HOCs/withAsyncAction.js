import { connect } from ".";
import * as actionCreators from "..";

const withAsyncAction = (reducerName, actionCreatorName) => component => {
  const makeError = message =>
    new Error(
      `${component.name} component: withAction: Failed to bind to action ${actionCreatorName}: ${message}`
    );

  if (actionCreatorName !== 'all' && !actionCreators[actionCreatorName]) {
    throw makeError(
      `${actionCreatorName} does not exist as an action creator function`
    );
  }

  const mapStateToProps = state => {
    if (!state[reducerName]) {
      throw makeError(`${reducerName} does not exist as a redux reducer`);
    }
    if (actionCreatorName !== 'all' && state[reducerName][actionCreatorName] === undefined) {
      throw makeError(
        `${actionCreatorName} does not exist as a property in redux state.${reducerName}`
      );
    }
    if (actionCreatorName !== 'all' && typeof state[reducerName][actionCreatorName] !== "object") {
      throw makeError(
        `${actionCreatorName} does not exist in redux state.${reducerName}.${actionCreatorName} as a javascript object with properties result, loading, and error`
      );
    }
    if (actionCreatorName !=='all') {
      const { loading, result, error } = state[reducerName][actionCreatorName];
      if (typeof loading !== "boolean") {
        throw makeError(
          `${actionCreatorName} does not exist in redux state.${reducerName}.${actionCreatorName} with a loading property that is a boolean value`
        );
      }
      if (result === undefined) {
        throw makeError(
          `${actionCreatorName} does not exist in redux state.${reducerName}.${actionCreatorName} with a result property`
        );
      }
      if (error === undefined) {
        throw makeError(
          `${actionCreatorName} does not exist in redux state.${reducerName}.${actionCreatorName} with an error property`
        );
      }
  
      return { ...state[reducerName][actionCreatorName] };
    }

    return { ...state[reducerName]};

  };

  const actionCreator = actionCreators[actionCreatorName];
  let mapDispatchToProps = { [actionCreatorName]: actionCreator };
  if (actionCreatorName === 'all') {
    mapDispatchToProps = actionCreators;
  } 
  


  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(component);
};

export default withAsyncAction;
