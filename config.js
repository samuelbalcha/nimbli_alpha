module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'stuff',
    MONGO_URI: process.env.IP || 'mongodb://localhost/nalpha',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'stuff',
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'stuff',
    AWS_KEYID : process.env.AWS_KEYID || 'stuff',
    AWS_SECRET : process.env.AWS_SECRET || 'stuff',
    AWS_BUCKET : process.env.AWS_BUCKET || 'stuff',
    AWS_ACL : process.env.AWS_ACL || 'public-read'
};
