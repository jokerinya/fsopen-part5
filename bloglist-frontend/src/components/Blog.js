import React, { useState } from 'react';
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
        <>
            <div>{blog.url}</div>
            <div>
                likes {blog.likes}{' '}
                <button onClick={handleLikeClick}>like</button>
            </div>
            <div>{blog.user.name}</div>
            {createdByUser && (
                <button onClick={handleRemoveClick}>remove</button>
            )}
        </>
    );

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button onClick={() => setViewDetails(!viewDetails)}>
                    {viewDetails ? 'hide' : 'view'}
                </button>
                {viewDetails && details()}
            </div>
        </div>
    );
};

export default Blog;
