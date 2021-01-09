require('./.test-variables');

const { stub } = require('sinon');
const userService = require('../src/services/user-service');
const authService = require('../src/services/auth-service');
const { expect } = require('chai');
const bcrypt = require('bcrypt');

describe('auth-service-test', () => {
    describe('login', () => {
        const usernameOrEmail = 'example@email.com';
        const password = 'password';

        it('should fail if user not found', async () => {
            // Arrange
            stub(userService, 'getUserByUsernameOrEmail').resolves(null);
            try {
                // Act
                await authService.login(usernameOrEmail, password);
            } catch (err) {
                // Assert
                expect(err).to.be.an('error');
            } finally {
                // CleanUp
                userService.getUserByUsernameOrEmail.restore();
            }
        });

        it('should fail if password is incorrect', async () => {
            // Arrange
            stub(bcrypt, 'compare').resolves(false);
            try {
                // Act
                await authService.login(usernameOrEmail, password);
            } catch (err) {
                // Assert
                expect(err).to.be.an('error');
            } finally {
                // CleanUp
                bcrypt.compare.restore();
            }
        });

        it('should return token if credentials are correct', async () => {
            // Arrange
            stub(userService, 'getUserByUsernameOrEmail').resolves({
                id: 'userId',
                email: usernameOrEmail,
            });
            stub(bcrypt, 'compare').resolves(true);

            try {
                // Act
                const token = await authService.login(
                    usernameOrEmail,
                    password
                );
                //Assert
                expect(token).to.be.not.null;
            } finally {
                // CleanUp
                userService.getUserByUsernameOrEmail.restore();
                bcrypt.compare.restore();
            }
        });
    });
});
