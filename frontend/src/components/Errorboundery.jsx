import React, { Component } from 'react';

// ErrorBoundary component
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorInfo: null,
        };
    }

    // This lifecycle method is called when an error is thrown by any child component
    static getDerivedStateFromError(error) {
        // Update state to indicate an error has been caught
        return { hasError: true };
    }

    // This lifecycle method is called with error details
    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error("Error caught in ErrorBoundary:", error);
        console.error("Error info:", errorInfo);

        // You can also set error details to the state if you want to display more detailed info
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render a custom fallback UI when an error occurs
            return (
                <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
                    <h2>Something went wrong.</h2>
                    <p>We're sorry, an error occurred while rendering the component.</p>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        <summary>Click for error details</summary>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children; // If no error, render the children components
    }
}

export default ErrorBoundary;
