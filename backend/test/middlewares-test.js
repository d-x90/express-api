const JWT_SIGN_KEY = 'longsecretkey';
process.env.JWT_SIGN_KEY = JWT_SIGN_KEY;

const { authenticateJWT } = require('../src/middlewares');
const { expect } = require('chai');
const { stub } = require('sinon');
const config = require('../src/config');

it('should use good jwt secret', () => {
    // Arrange
    const req = {
        headers: {},
    };
    const res = {
        status: (status_code) => {},
    };

    // Act
    const jwt_secret = config.JWT_SIGN_KEY;
    // Assert
    expect(jwt_secret).to.be.equal(JWT_SIGN_KEY);
});

it('should throw error if no authorization header is provided', () => {
    // Arrange
    const req = {
        headers: {},
    };
    const res = {
        status: (status_code) => {},
    };

    // Act
    // Assert
    expect(authenticateJWT.bind(this, req, res)).to.throw('Unauthorized');
});

it('should throw error if invalid token is provided', () => {
    // Arrange
    const req = {
        headers: { authorization: 'Bearer asd' },
    };
    const res = {
        status: (status_code) => {},
    };

    // Act
    // Assert
    expect(authenticateJWT.bind(this, req, res)).to.throw('Forbidden');
});

it('should call next on valid JWT', () => {
    // Arrange
    const validJwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjczMzc4MDdlLWJiNjctNDlmNS04NDRiLWM2MjBhNjcyMzg2ZiIsInVzZXJuYW1lIjoibm9jdGlzIiwiZW1haWwiOiJub2N0aXNicmFoQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYwOTk2NDk2MiwiZXhwIjoxNjEwMDUxMzYyfQ.PW6LsnZCvvaBcEqhHO0TDg7pvvXUM1_qUBscgL5mo18';
    const req = {
        headers: { authorization: `Bearer ${validJwt}` },
    };
    const res = {
        status: (status_code) => {},
    };
    const next = stub();

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(next.calledOnce).to.be.true;
});
