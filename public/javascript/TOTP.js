const crypto = require('crypto')
const qrcode = require('qrcode')
const base32 = require('thirty-two')

/**
 * Cette classe permet de gérer manuellement les TOTP
 * @class TOTP
 */
class TOTP {
    /**
     * @param {string} secret mot de passe partagé entre le client et le serveur
     * @param {number} interval le nombre de secondes d'intervalle entre deux changements d'OTP
     */
    constructor (secret, interval = 30) {
        this.secret = secret
        this.interval = interval
    }

    /**
     * @param {integer} int le nombre à convertir en string
     * @param {integer} padding la taille totale de la string
     * @return {Array}
     */
    intToBytes (int, padding = 8) {
        const bytes = []

        for (let i = 7; i >= 0; i--) {
            bytes[i] = int & 0xFF
            int = int >> 8
        }

        return bytes
    }

    /**
     * Converts Hex string to bytes
     * @param {String} hex string of hex to convert to byte array
     * @return {Array} bytes
     */
    hexToBytes (hex) {
        var bytes = []
        for (let c = 0, C = hex.length; c < C; c += 2) {
            let byte = hex.substr(c, 2)
            bytes.push(parseInt(byte, 16))
        }

        return bytes
    }

    /**
     * Cette fonction génère de A à Z l'OTP
     * @param {integer} input est le facteur temps qui rend le mot de passe différent à chaque itération
     * @return {string} 6 digit string
     */
    async generate (input) {
        // Generate the HMAC encryptor, with our secret key `this.secret`
        const hmac = crypto.createHmac('sha1', Buffer.from(this.secret, 'utf8'))

        // convert our input (the timestamp) to bytes, in reverse order with a padding of zeros
        const inputBytes = Buffer.from(this.intToBytes(input))

        // hash our inputBytes
        hmac.update(inputBytes)

        // get the digest (the hashing result) in an hexadecimal form
        const digest = hmac.digest('hex')

        // convert the hexadecimal representation to bytes in an array
        const hash = this.hexToBytes(digest)

        // to select the 4 bytes window offset, we choose the last byte of our hash
        const offset = hash[19] & 0x0F

        // then we take the 4 bytes next to our offset
        const code = (
            (hash[offset] & 0x7f) << 24 |
            (hash[offset + 1] & 0xFF) << 16 |
            (hash[offset + 2] & 0xFF) << 8 |
            (hash[offset + 3] & 0xFF)
        )

        // then we get the remainder of the division and convert it to string
        let result = (code % 1000000) + ''

        // we add 0 padding if result is less than 6 digits long
        for (let i = result.length; i < 6; i++) {
            result = '0' + result
        }
        return result
    }

    /**
     * Génère l'OTP pour la date actuelle
     * @return {string}
     */
    async now () {
        return this.generate(this.timecode(Date.now()))
    }

    /**
     * Génère l'OTP pour une date donnée
     * @param {Date} forTime
     * @param {integer} counterOffset permet de tester l'OTP sur les N secondes précédentes ou suivantes
     * @return {string}
     */
    async at (forTime, counterOffset = 0) {
        return this.generate(this.timecode(forTime) + counterOffset)
    }

    /**
     * Vérifie la validité d'un OTP
     * @param {string} otp mot de passe à vérifier
     * @param {Date} forTime date du mot de passe
     * @param {integer} validWindow décalage dans le temps autorisé (-30s + 30s par exemple). en unités
     * @return {boolean}
     */
    async verify (otp, forTime, validWindow = 0) {
        if (!forTime) {
            forTime = Date.now()
        }

        if (validWindow) {
            for (var i = -validWindow; i < validWindow + 1; i++) {
                let result = await this.at(forTime, i)
                if (otp === result) {
                    return true
                }
            }
            return false
        }

        return otp === await this.at(forTime)
    }

    /**
     * Génère un timecode en fonction de la date voulue et de l'intervalle de rafraichissement
     * @param {integer} forTime timestamp en millisecondes
     * @return {integer}
     */
    timecode (forTime) {
        return Math.floor(Math.floor(forTime / 1000) / this.interval)
    }

    /**
     * Génère une url de synchronisation avec les outils comme Google Authenticator
     * @param {string} name identifiant du compte
     * @param {string} issuer nom de l'organisme émetteur du token
     * @return {string}
     */
    uri (name, issuer) {
        if (!name) {
            throw new Error('Name this OTP')
        }

        if (!issuer) {
            throw new Error('Name your organization')
        }

        let b32 = base32.encode(this.secret)

        let uri = `otpauth://totp/${issuer}:${name}?secret=${b32}&issuer=${issuer}&algorithm=SHA1`

        return uri
    }

    /**
     * Génère un QRCode
     * @param {string} name identifiant du compte
     * @param {string} issuer nom de l'organisme émetteur du token
     */
    qrcode (name, issuer) {
        let uri = this.uri(name, issuer)

        qrcode.toFile('qrcode.jpeg', uri, {type: 'image/png'}, function (err) {
            if (err) throw err
        })
    }
}

module.exports = TOTP