describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'AdminArto',
      username: 'admin',
      password: 'root'
    }

    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown by default', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct creds', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('root')
      cy.get('#login-button').click()

      cy.contains('AdminArto logged in')
    })

    it('fails with wrong creds', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.notifError').contains('Invalid username or password')
      cy.get('html').should('not.contain', 'AdminArto logged in')
    })
  })

  describe('Logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'root' })
    })

    it('A blog can be created', function() {
      cy.get('#visibilityButton').click()
      cy.get('#title').type('TestBlog')
      cy.get('#author').type('Admin')
      cy.get('#url').type('www.example.com')
      cy.get('#submitButton').click()

      cy.contains('TestBlog')
      cy.contains('Admin')
    })

    describe('Blog already exists', function() {
      this.beforeEach(function() {
        cy.createBlog({
          title: 'TestBlog',
          author: 'Admin',
          url: 'www.example.com'
        })
      })

      it('blog can be liked (in frontend)', function() {
        cy.get('#blogShowButton').click()
        cy.contains('Likes: 0')
        cy.get('#likeButton').click()
        cy.contains('Likes: 1')
      })

      it('blog can be deleted', function() {
        cy.get('#blogShowButton').click()
        cy.contains('TestBlog Admin')
        cy.get('#removeBlogButton').click()
        cy.get('html').should('not.contain', '.blog')
      })

      it('blogs are sorted in correct order', function() {
        cy.createBlog({
          title: 'asdd',
          author: 'ArtoHellas',
          url: 'www.exumple.com'
        })

        cy.get('div.blog').each(() => {
          cy.get('#blogShowButton').click()
        })

        cy.get('div.blog').then((blogs) => {
          console.log(blogs[0].textContent)
          console.log(blogs[1].textContent)

          console.log(blogs)
          cy
            .get(blogs[1])
            .find('#likeButton')
            .click()
            .then(() => {
              cy
                .get('div.blog')
                .first()
                .should('not.contain', 'TestBlog')
                .contains('asdd')
            })
        })
      })
    })
  })
})