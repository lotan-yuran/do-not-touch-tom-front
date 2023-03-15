import { Component } from "react";

// Hooks
import { useWritingLog } from "../hooks/useWritingLog";

// Smart components
import { DialogError } from "../smartComponents/DialogError/DialogError";

class ErrorBoundaryMain extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      messageDialog: error.messageDialog,
      error: error.response ? error.response : error
    };
  }

  componentDidCatch(error) {
    this.props.customTrackException(error);
  }

  render() {
    return (
      <>
        {!this.state.hasError && this.props.children}
        <DialogError
          fullScreen={true}
          open={this.state.hasError}
          messageDialog={this.state.messageDialog}
          onOK={() => this.setState({ ...this.state, hasError: false, messageDialog: null })}
        />
      </>
    );
  }
}

export const withHooksHOC = Component => {
  return props => {
    const { customTrackException } = useWritingLog();
    return <Component customTrackException={customTrackException} {...props} />;
  };
};

export default withHooksHOC(ErrorBoundaryMain);
