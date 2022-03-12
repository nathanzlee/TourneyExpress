import User from '../schemas/user.js';
import crypto from 'crypto';

export const newuser = (req, res) => {
    const user = new User(req.body)
        , salt = crypto.randomBytes(128).toString('base64')
        , password = req.body.password;
    crypto.pbkdf2(password, salt, 10000, 256, 'sha256', (err, hash) => {
        if (err) {
            return res.send('error');
        }
        user.password = hash.toString('base64');
        user.salt = salt;
        try {
            user.save();
        } catch (e) {
            console.log(e.message);
        }
        
    });
}

export const login = (req, res) => {
    console.log("Called")
    const user = User.find({username: req.body.username}, (err, person) => {
        if (err || person.length == 0) {
            return res.json({err: 'Wrong username'});
        } 
        const salt = person[0].salt, password = req.body.password;
        crypto.pbkdf2(password, salt, 10000, 256, 'sha256', (err, hash) => {
            if (err) {
                return res.send('error');
            }
            if (hash.toString('base64') == person[0].password) {
                return res.send({msg: 'Success!', user: person[0]});
            } else {
                return res.json({err: 'Wrong password'});
            }
        })
    })
    

}

