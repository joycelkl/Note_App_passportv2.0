const bcrypt = require('bcrypt');

function hashPassword(password) {
    console.log('before hash', password)
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(password, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(password, hashedPassword) {
    return new Promise((resolve, reject) => {
        console.log('check password function');
        bcrypt.compare(
            password, hashedPassword, (err, match) => {
                if (err) {
                    reject(err)
                }
                resolve(match)
            }
        )
    })

}

module.exports = {
    checkPassword: checkPassword,
    hashPassword: hashPassword,
}