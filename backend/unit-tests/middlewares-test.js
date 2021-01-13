require('./.test-variables');

const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../src/middlewares');
const { expect } = require('chai');
const { stub } = require('sinon');
const userService = require('../src/services/user-service');

describe('middlewares-test', () => {
    describe('authenticateJWT middleware', () => {
        const req = {
            headers: {},
        };
        const res = {
            status: (status_code) => {},
        };

        it('should throw error if no authorization header is provided', async () => {
            // Arrange
            req.headers.authorization = undefined;
            let argOfNext = null;
            const next = (err) => {
                argOfNext = err;
            };

            // Act
            await authenticateJWT(req, res, next);

            // Assert
            expect(argOfNext.message).to.be.equal('Unauthorized');
        });

        it('should throw error if invalid token is provided', async () => {
            // Arrange
            req.headers.authorization = 'Bearer asd';
            let argOfNext = null;
            const next = (err) => {
                argOfNext = err;
            };

            // Act
            await authenticateJWT(req, res, next);

            // Assert
            expect(argOfNext.message).to.be.equal('Forbidden');
        });

        it('should throw error if jwt is issued before the jwtValidAfter date', async () => {
            // Arrange
            req.headers.authorization = `Bearer validJwt`;
            let argOfNext = null;
            const next = (err) => {
                argOfNext = err;
            };
            stub(jwt, 'verify');
            jwt.verify.returns({
                id: 'GUID',
                iat: new Date('1970.01.01').getTime() / 1000,
            });
            stub(userService, 'getJwtValidAfterDateById');
            userService.getJwtValidAfterDateById.returns(
                Promise.resolve(new Date())
            );

            // Act
            await authenticateJWT(req, res, next);

            // Assert
            expect(argOfNext.message).to.be.equal('Forbidden');

            // Cleanup
            jwt.verify.restore();
            userService.getJwtValidAfterDateById.restore();
        });

        it('should throw error if user referenced in jwt does not exist', async () => {
            // Arrange
            req.headers.authorization = `Bearer validJwt`;
            let argOfNext = null;
            const next = (err) => {
                argOfNext = err;
            };
            stub(jwt, 'verify');
            jwt.verify.returns({
                id: 'GUID',
                iat: new Date('1970.01.01').getTime() / 1000,
            });
            stub(userService, 'getJwtValidAfterDateById');
            userService.getJwtValidAfterDateById.throws(
                new Error('User not found')
            );

            // Act
            await authenticateJWT(req, res, next);

            // Assert
            expect(argOfNext.message).to.be.equal('Forbidden');

            // Cleanup
            jwt.verify.restore();
            userService.getJwtValidAfterDateById.restore();
        });

        it('should add userInfo to req when JWT is valid', async () => {
            // Arrange
            req.headers.authorization = `Bearer validJwt`;
            const next = stub();
            stub(jwt, 'verify');
            jwt.verify.returns({ id: 'GUID', iat: Date.now() / 1000 });
            stub(userService, 'getJwtValidAfterDateById');
            userService.getJwtValidAfterDateById.returns(
                Promise.resolve(new Date('1970.01.01'))
            );

            // Act
            await authenticateJWT(req, res, next);

            // Assert
            expect(req).to.have.property('userInfo');

            // Cleanup
            jwt.verify.restore();
            userService.getJwtValidAfterDateById.restore();
        });
    });
});
