import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import Login from '../components/login';
import {
  login,
  setIsAuthorised,
  clearAuthLoader,
  clearError,
  hideLibErrPopup } from '../actions/auth';

const mapStateToProps = (state) => (
  {
    networkState: state.networkState.state,
    error: state.auth.error,
    loading: state.auth.loading,
    isAuthorised: state.auth.isAuthorised,
    libErrPopup: state.auth.libErrPopup
  }
);

const mapDispatchToProps = (dispatch) => (
 {
   push: (path) => dispatch(push(path)),
  ...bindActionCreators({
    login,
    clearAuthLoader,
    clearError,
    setIsAuthorised,
    hideLibErrPopup }, dispatch)
 }
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
