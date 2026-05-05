const { expressjwt: expressJwt } = require('express-jwt');
const { Roles } = require('../enums/role');

function authJwt() {
    const secret = process.env.MY_SECRET;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: `${api}/citizenships`,  methods: ['GET'] },
            { url: `${api}/users/register`, methods: ['POST'] },
            { url: `${api}/users/login`, methods: ['POST'] }
        ]
    })
}

async function isRevoked(req, token) {
    return !(token.payload.role == Roles.superhero || token.payload.role == Roles.hero);
}


module.exports = authJwt