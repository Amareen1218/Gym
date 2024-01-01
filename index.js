const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;
const databaseName = 'GymFitnessManagement';

app.use(cors());

//express.json
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

// async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }

// Collections
let adminCollection;
let hostCollectionName;
let viewCollection;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(client => {
  console.log('Connected to MongoDB'); 
  const db = client.db('GymFitnessManagement');
  adminCollection = db.collection('adminCollection');
  hostCollectionName = db.collection('hostCollectionName');
  viewCollection = db.collection('viewCollection');
});

 // Start the server or perform other operations
 const { ObjectId } = require('mongodb');

// const db = client.db('GymFitnessManagement');
//   adminCollection = db.collection('adminCollection');
//   hostCollectionName = db.collection('hostCollectionName');

// Register new user

//Function Register Admin
async function registerAdmin(reqAdminUsername, reqAdminPassword, reqAdminName, reqAdminEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();


    // Validate the request payload
    if (!reqAdminUsername || !reqAdminPassword || !reqAdminName || !reqAdminEmail) {
      throw new Error('Missing required fields');
    }

    await adminCollection.insertOne({
      Username: reqAdminUsername,
      Password: reqAdminPassword,
      name: reqAdminName,
      email: reqAdminEmail,
    });

    return 'Registration Complete!!';
    } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('An error occurred during registration.');
   } finally {
    await client.close();
  }
}

//Function User Register
async function register(reqUsername, reqPassword, reqName, reqEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    // Validate the request payload
    if (!reqUsername || !reqPassword || !reqName || !reqEmail) {
      throw new Error('Missing required fields');
    }
    await hostCollectionName.insertOne({
      Username: reqUsername,
      Password: reqPassword,
      name: reqName,
      email: reqEmail,
    });
    return 'Registration Complete!!';
    } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('An error occurred during registration.');
   } finally {
    await client.close();
  }
 }

//  Delete user
app.delete('/delete/user/:username/:userType',verifyToken, async (req, res) => {
  const viewCollection = req.params.viewCollection;
  try {
    const result = await deleteUser(username, userType);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all user details function
app.get('/visit-details',verifyToken, (req, res) => {
  viewCollection
    .find({})
    .toArray()
    .then((visitCollecton) => {
      res.json(visitDetails);
    })
    .catch((error) => {
      console.error('Error retrieving visit details:', error);
      res.status(500).send('An error occurred while retrieving visit details');
    });
});

// Register user 

// app.post('/register/user', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await registerUser(username, password, 'user');
//     res.status(200).json({ message: result });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });




// View all user 
app.get('visit-details',verifyToken , (req, res) => {
  visitCollection
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

// // Express route for admin login
// app.post('/login/admin', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await loginAdmin(username, password);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

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

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    // Continue with your application logic or routes setup
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

//Register Admin
app.post('/register-admin', (req, res) => {
  console.log(req.body);

  registerAdmin(req.body.Username, req.body.Password, req.body.name, req.body.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

//Register User
app.post('/register', (req, res) => {
  console.log(req.body);

  register(req.body.Username, req.body.Password, req.body.name, req.body.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
    res.status(400).send(error.message);
    });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});