const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;
const databaseName = 'GymFitnessManagement';

app.use(cors());
app.use(express.json());

//await connectToMongoDB();

// MongoDB setup
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://amareen:4252621812-aA@cluster0.cihdsmn.mongodb.net/?retryWrites=true&w=majority';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gym Fitness Management System',
      version: '1.0.0',
    },
  },
  apis: ['./swagger.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Collections
let adminCollection;
let hostCollectionName;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(client => {
  console.log('Connected to MongoDB'); 
  const db = client.db('GymFitnessManagement');
  adminCollection = db.collection('adminCollection');
  hostCollection = db.collection('hostCollectionName');
});

// const db = client.db('GymFitnessManagement');
//   adminCollection = db.collection('adminCollection');
//   hostCollectionName = db.collection('hostCollectionName');

// Register new user
async function registerUser(username, password, userType) {
  const client = new MongoClient(uri);
  try {
    if (!username || !password || !userType) {
      throw new Error('Missing required fields');
    }

    let matchuser = await hostCollection.findOne({ Username: reqUsername });

    if (!matchuser) {
      throw new Error('Username already exists');
    }
    if (matchuser.Password === reqPassword) {
      return {
        user: matchuser,
      };
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error('An error occurred during login.');
  } finally {
    await client.close();
  }
}

//Function Generate Token
function generateToken(user) {
  const payload = 
  {
    username: user.AdminUsername,
  };
  const token = jwt.sign
  (
    payload, 'inipassword', 
    { expiresIn: '1h' }
  );
  return token;
}

//Function Verify
function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  console.log(header);

  let token = header.split(' ')[1];

  jwt.verify(token, 'inipassword', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

// Express routes

app.post('/register/user', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await registerUser(username, password, 'user');
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/register/admin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await registerUser(username, password, 'admin');
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function deleteUser(username, userType) {
  try {
    const collection = userType === 'admin' ? adminCollection : hostCollectionName;
    
    const result = await collection.deleteOne({ username });
    
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }

    return 'User deleted successfully';
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw new Error('Deletion failed');
  }
}

// Express route for deleting a user
app.delete('/delete/user/:username/:userType',verifyToken, async (req, res) => {
  const { username, userType } = req.params;
  try {
    const result = await deleteUser(username, userType);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all user details function
app.get('/visit-details',verifyToken, (req, res) => {
  adminCollection
    .find({})
    .toArray()
    .then((visitDetails) => {
      res.json(visitDetails);
    })
    .catch((error) => {
      console.error('Error retrieving visit details:', error);
      res.status(500).send('An error occurred while retrieving visit details');
    });
});


// Express route for getting all users
app.get('/users/:userType', async (req, res) => {
  const { userType } = req.params;
  try {
    const users = await getAllUsers(userType);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User function
async function loginUser(reqUsername, reqPassword) {
  try {
    if (!reqUsername || !reqPassword) {
      throw new Error('Missing required fields');
    }

    const user = await hostCollectionName.findOne({ username: reqUsername });

    if (!user || user.password !== reqPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);

    return {
      message: 'Login successful',
      token: token,
    };
  } catch (error) {
    console.error('Login Error:', error.message);
    throw new Error('Login failed');
  }
}

// Express route for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await loginUser(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin login function
app.post('/login-Admin', (req, res) => {
  console.log(req.body);

  Adminlogin(req.body.Username, req.body.Password)
    .then((result) => {
      let token = generateToken(result);
      res.send(token);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

// Express route for admin login
app.post('/login/admin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await loginAdmin(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    // Continue with your application logic or routes setup
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});