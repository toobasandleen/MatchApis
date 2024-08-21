const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./models');
const libraryRoutes = require('./Routes/libraryRoutes');
const gameRoutes = require('./Routes/gameRoutes');
const crudUser = require('./Routes/curdRoutes');


app.use(express.json());
const cors = require('cors');
app.use(cors());1

// update user
app.use('/UserCruds',crudUser);
app.use('/library', libraryRoutes);
app.use('/games', gameRoutes);


db.sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Unable to sync the database:', err);
  });

const PORT = process.env.PORT || 4000; // Default to port 3000 if PORT environment variable is not set

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app






// For redis //
// we have first install redis client on our systems  npm install redis
// then we install redis server using brew => brew install redis
// then we start the redis server by the command =>  brew services start redis