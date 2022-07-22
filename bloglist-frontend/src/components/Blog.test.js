import React from 'react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 13,
    user: {
        username: 'hellas',
        name: 'Arto Hellas',
        id: '62c9d713cfb0e98bb430d4be',
    },
    id: '62cb14c80e44c4d5484537b4',
};

const user = {
    username: 'hellas',
    name: 'Arto Hellas',
    token: '62c9d713cfb0e98bb430d4be',
};

test('renders the blog`s title and author', () => {
    const { container } = render(<Blog blog={blog} user={user} />);

    // const element = screen.getByText('React patterns', { exact: false });
    const element = container.querySelector('.blog-container');
    expect(element).toBeDefined();
});

test('button controlling the shown details has been clicked', async () => {
    const { container } = render(<Blog blog={blog} user={user} />);

    const fakeUser = userEvent.setup();
    const button = screen.getByText('view');
    await fakeUser.click(button);

    const div = container.querySelector('.blog-details');
    expect(div).toBeDefined();
});

test('like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const mockHandler = jest.fn();

    render(<Blog blog={blog} user={user} onBlogLike={mockHandler} />);

    const fakeUser = userEvent.setup();
    const viewButton = screen.getByText('view');
    await fakeUser.click(viewButton);
    const likeButton = screen.getByText('like');
    await fakeUser.dblClick(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
});
