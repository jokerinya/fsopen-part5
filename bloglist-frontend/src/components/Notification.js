import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message }) => {
    if (message.type === null || message.content === null) {
        return null;
    }
    return <div className={message.type}>{message.content}</div>;
};

Notification.propTypes = {
    message: PropTypes.shape({
        type: PropTypes.oneOf(['success', 'error']) || null,
        content: PropTypes.string || null,
    }).isRequired,
};

export default Notification;
