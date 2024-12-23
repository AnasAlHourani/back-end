const path = require('path');
const express = require('express');
const appPort = require('./config/main').appPort;
const app = express();
const sequelize = require('./config/Sequelize');
const bodyParser = require('body-parser');
const multer = require('multer');
const profileImgDisk = require('./config/File').profileImgDisk;
const startApp = require('./Dev/StartApp');

const authRoutes = require('./Routes/Auth');
const userRoutes = require('./Routes/User');
const adminRoutes = require('./Routes/Admin');
const notficationRoutes = require('./Routes/Notficaiton');

app.use(bodyParser.json());
const auth = require('./Controllers/AuthController').auth;
const isAdmin = require('./Controllers/AuthController').isAdmin;
app.use(express.static(path.join(__dirname,'images')));

app.use('/auth',authRoutes);

app.use(auth);


app.use(multer({storage: profileImgDisk.fileStorage , fileFilter: profileImgDisk.fileFilter}).single('image'));
//user routes 
app.use('/user',userRoutes);
app.use('/notfication',notficationRoutes);

//admin routes
app.use(isAdmin);
app.use('/admin',adminRoutes);

sequelize.authenticate()
.then(()=>{
    // sequelize.sync({force: true})
    sequelize.sync()
    .then(_=>{
        return startApp;
    })
    .then(()=>{
        app.listen(appPort);console.log('APP IS RUNNING ON URL: http://localhost:'+appPort+'/');
    }).catch(err=>{
        console.log('ERROR IN DB SEQUELIZE CONNECTION WITH SYNC');
    })
})
.catch(err=>{
    console.log('ERROR IN DB SEQUELIZE CONNECTION WITH AUTHENTICATE');
});