describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/v1/testing/reset');
        // create here a user to backend
        // support/command.js myCreateUser custom command without UI
        cy.myCreateUser({
            username: 'jokerinya',
            name: 'Ibrahim Sakaci',
            password: 'secretsecret',
        });
    });

    it('Login form is shown', function () {
        cy.contains('log in to application');
        cy.get('#username');
    });

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('jokerinya');
            cy.get('#password').type('secretsecret');
            cy.get('#login-submit-button').click();
            cy.contains('Ibrahim Sakaci logged in');
        });

        it('fails with wrong credentials', function () {
            cy.get('#username').type('jokerinya');
            cy.get('#password').type('wrong');
            cy.get('#login-submit-button').click();
            cy.get('.error')
                .should('contain', 'invalid username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid');

            cy.get('html').should('not.contain', 'Ibrahim Sakaci logged in');
        });
    });

    describe('When logged in', function () {
        beforeEach(function () {
            // support/command.js myLogin custom command without UI
            cy.myLogin({ username: 'jokerinya', password: 'secretsecret' });
        });

        it('A blog can be created', function () {
            cy.contains('new blog').click();
            cy.get('#blog-title-input').type('A new Blog');
            cy.get('#blog-author-input').type('Ibrahim Sakaci');
            cy.get('#blog-url-input').type('https://github.com/jokerinya');
            cy.get('#blog-submit-button').click();
            cy.contains('a new blog A new Blog by Ibrahim Sakaci added');
        });

        describe('and several note exists', function () {
            beforeEach(function () {
                // create 3 blogs for testing
                cy.myCreateBlog({
                    title: 'first blog has min likes',
                    author: 'Ibrahim Sakaci',
                    url: 'https://github.com/jokerinya',
                    likes: 0,
                });
                cy.myCreateBlog({
                    title: 'second blog has max likes',
                    author: 'Ibrahim Sakaci',
                    url: 'https://github.com/jokerinya',
                    likes: 2,
                });
                cy.myCreateBlog({
                    title: 'third blog',
                    author: 'Ibrahim Sakaci',
                    url: 'https://github.com/jokerinya',
                    likes: 1,
                });
            });

            it('one of those can be liked', function () {
                // adding button to a variable
                cy.contains('second blog').parent().as('theParent');
                cy.get('@theParent').contains('view').click();
                cy.get('@theParent').find('.blog-like-button').click();
                cy.get('@theParent').contains('likes 3');
            });

            it('creater of a blog can delete it', function () {
                cy.contains('third blog').parent().as('theParent');
                cy.get('@theParent').contains('view').click();
                cy.get('@theParent').contains('remove').click();

                cy.get('html').should(
                    'not.contain',
                    'thrid blog Ibrahim Sakaci'
                );
            });

            it('other user cannot delete the blog', function () {
                // create a new user support/command.js myCreateUser custom command without UI
                cy.myCreateUser({
                    username: 'second',
                    name: 'Another User',
                    password: 'password',
                });
                // login as a new user
                cy.myLogin({ username: 'second', password: 'password' });
                // there should not be a remove button
                cy.contains('third blog').parent().as('theParent');
                cy.get('@theParent').contains('view').click();
                cy.get('@theParent')
                    .find('button')
                    .should('not.contain', 'remove');
            });

            it('the blogs are ordered according to likes', function () {
                // get gets elements and eq brings elements according to their index number
                cy.get('.blog-container')
                    .eq(0)
                    .contains('second blog has max likes');
                cy.get('.blog-container').eq(1).contains('third blog');
                cy.get('.blog-container')
                    .eq(2)
                    .contains('first blog has min likes');
            });
        });
    });
});
