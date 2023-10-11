const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(bodyParser.urlencoded({ extended: true, useUnifiedTopology: true }));
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// MongoDB Atlas connection URL
const mongoURI = 'mongodb+srv://user1:root@initialload.qj5mr8z.mongodb.net/joborr-db?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a Mongoose schema for job listings
const jobSchema = new mongoose.Schema({
  "Job Title": String,
  Rating: Number,
  "Company Name": String,
  Headquarters: String,
  Type: String,
  avg_salary: Number,
  status: String, // Add a status field for job application
});

// Create a Mongoose model for job listings
const Job = mongoose.model('Job', jobSchema);

// Define a route to create a new job
app.post('/api/jobs', async (req, res) => { // Change the route to '/api/jobs'
  try {
    const jobData = req.body;
    jobData.status = 'Not Applied'; // Initialize job status
    const job = new Job(jobData);
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Define a route to retrieve and display the job listings
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Define a route to update a job by ID
app.put('/api/jobs/:id', async (req, res) => { // Change the route to '/api/jobs/:id'
  try {
      const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedJob) {
          return res.status(404).json({ error: 'Job not found' });
      }
      res.json(updatedJob);
  } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Server Error' });
  }
});

// Define a route to delete a job by ID
app.delete('/api/jobs/:id', async (req, res) => { // Change the route to '/api/jobs/:id'
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Define a route to retrieve and display the job listings
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Serve HTML files based on the route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/jobsearch.html');
});

app.get('/job-creation', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
