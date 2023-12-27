const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port =  3000;
const MongoURI = 'mongodb+srv://amareen:4252621812-aA@cluster0.cihdsmn.mongodb.net/'; 

app.use(express.json());
app.use(cors());

// MongoDB setup
const client = new MongoClient(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

const db = client.db('CondoVisitorManagement');
  adminCollection = db.collection('adminCollection');
  //visitDetailCollection = db.collection('visitDetailCollectionName');
  //securityCollection = db.collection('securityCollectionName');
  hostCollectionName = db.collection('hostCollectionName')



// Connect to MongoDB
connectToMongoDB();


// Register new user
async function registerUser(username, password, userType) {
  try {
    if (!username || !password || !userType) {
      throw new Error('Missing required fields');
    }

    const collection = userType === 'admin' ? adminCollection : hostCollectionName;

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const newUser = {
      username,
      password,
      userType,
    };

    await collection.insertOne(newUser);

    return 'Registration successful';
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw new Error('Registration failed');
  }
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
app.delete('/delete/user/:username/:userType', async (req, res) => {
  const { username, userType } = req.params;
  try {
    const result = await deleteUser(username, userType);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all user details function
async function getAllUsers(userType) {
  try {
    const collection = userType === 'admin' ? adminCollection : hostCollectionName;

    const users = await collection.find({}).toArray();

    return users;
  } catch (error) {
    console.error('Error getting all users:', error.message);
    throw new Error('Failed to retrieve user details');
  }
}

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
async function loginAdmin(reqUsername, reqPassword) {
  try {
    if (!reqUsername || !reqPassword) {
      throw new Error('Missing required fields');
    }

    const adminUser = await adminCollection.findOne({ username: reqUsername });

    if (!adminUser || adminUser.password !== reqPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(adminUser);

    return {
      message: 'Admin login successful',
      token: token,
    };
  } catch (error) {
    console.error('Admin Login Error:', error.message);
    throw new Error('Admin login failed');
  }
}

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


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});