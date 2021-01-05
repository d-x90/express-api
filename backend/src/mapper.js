const mapper = {};

mapper.mapUserToUserDto = (user) => {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        lastName: user.lastName,
        firstName: user.firstName,
        role: user.role,
        createdAt: user.createdAt,
    };
};

module.exports = mapper;
