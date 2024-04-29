import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/userModel.js';


const initializeGitHubPassport = () => {
    const CLIENT_ID = "Iv1.3ba31aa9dedaeb4e";
    const SECRET_ID = "88ad705efc2bf1b26fcfb7ada1ccc9de0942c263";

    passport.use(
        'github',
        new GitHubStrategy({
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
        },

        async (accessToken, refreshToken, profile, done) => {
            try{
                console.log(profile);
                let user = await userModel.findOne({ username : profile._json.login})
                if(!user) {
                    let newUser = {
                        username: profile._json.login,
                        name: profile._json.name,
                        password: ""
                    }
                    let result = await userModel.create(newUser);
                    done(null, result);
                }else{
                    return done(null, user);
                }
            }catch (error) {
                return done(error)
            }
        }));

        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
        });
}

export default initializeGitHubPassport;