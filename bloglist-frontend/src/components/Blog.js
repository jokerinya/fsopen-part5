import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, user, onBlogLike, onBlogDelete }) => {
    const [viewDetails, setViewDetails] = useState(false);

    const createdByUser = blog.user.username === user.username;

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    };

    const handleLikeClick = () => {
        const updatedBlogObj = {
            ...blog,
            user: blog.user.id,
            likes: blog.likes + 1,
        };
        onBlogLike(updatedBlogObj);
    };

    const handleRemoveClick = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            onBlogDelete(blog.id);
        }
    };

    const details = () => (
        <div className='blog-details'>
            <div>{blog.url}</div>
            <div>
                likes {blog.likes}{' '}
                <button className='blog-like-button' onClick={handleLikeClick}>
                    like
                </button>
            </div>
            <div>{blog.user.name}</div>
            {createdByUser && (
                <button
                    className='blog-remove-button'
                    onClick={handleRemoveClick}
                >
                    remove
                </button>
            )}
        </div>
    );

    return (
        <div style={blogStyle} className='blog-container'>
            <div>
                {blog.title} {blog.author}
                <button onClick={() => setViewDetails(!viewDetails)}>
                    {viewDetails ? 'hide' : 'view'}
                </button>
            </div>
            {viewDetails && details()}
        </div>
    );
};

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onBlogLike: PropTypes.func,
    onBlogDelete: PropTypes.func,
};

export default Blog;
