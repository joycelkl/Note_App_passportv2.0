const bcrypt = require('bcrypt');

function hashPassword(password) {
    console.log('before hash', password)
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) {
                console.log('genSalt err', err)
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    console.log('hash error', err)
                    reject(err);
                }
                console.log('hashed', hash)
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