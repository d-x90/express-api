require('./.test-variables');

const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../src/middlewares');
const { expect } = require('chai');
const { stub } = require('sinon');
const config = require('../src/config');

describe('middlewares-test', () => {
    describe('authenticateJWT middleware', () => {
        const req = {
            headers: {},
        };
        const res = {
            status: (status_code) => {},
        };

        it('should throw error if no authorization header is provided', () => {
            // Arrange
            // Act
            // Assert
            expect(authenticateJWT.bind(this, req, res)).to.throw(
                'Unauthorized'
            );
        });

        it('should throw error if invalid token is provided', () => {
            // Arrange
            req.headers.authorization = 'Bearer asd';

            // Act
            // Assert
            expect(authenticateJWT.bind(this, req, res)).to.throw('Forbidden');
        });

        it('should call next on valid JWT', () => {
            // Arrange
            req.headers.authorization = `Bearer validJwt`;
            const next = stub();
            stub(jwt, 'verify');
            jwt.verify.returns({ id: 'GUID' });

            // Act
            authenticateJWT(req, res, next);

            // Assert
            expect(req).to.have.property('userInfo');
            expect(next.calledOnce).to.be.true;

            // Cleanup
            jwt.verify.restore();
        });
    });
});
