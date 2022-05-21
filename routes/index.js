const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const Project = require('../models/Project');
const User = require('../models/User');
const Likes = require('../models/likes');
const axios = require('axios');

router.get('/', async (req, res) => {

  res.render('homepage', {
    layout: './layouts/login',
  });
});

router.post('/dashboard', async (req, res) => {
  // console.log(req.body)
  if(req.body.username){
    const username = req.body.username;
  }
  else if(req.params.username){
    const username = req.params.username;
  }
  // console.log(username);
  const user = await User.findOne({UserName: username})
  // console.log(user);
  if(user.UserType === 'student'){
    const projects = await Project.find({ Status: 'Approved'});
    for(let i = 0; i < projects.length; i++){
      projects[i].isliked = false;
    }

    const likedPost = await Likes.find({userGuid : username});
    for(let  i = 0;i < projects.length;i++)
    {
      for(let j = 0;j<likedPost.length;j++)
      { 
        // console.log(projects[i]._id,likedPost[j].projectGuid)
        if(projects[i]._id == likedPost[j].projectGuid)
        {
          projects[i].isliked = true
          // console.log('if here');
        }
      }
      // console.log('outer loop here');
    }
    // console.log(projects);
    res.render('studentDashboard', { layout: './layouts/main_home', user, projects });
  }
  else if(user.UserType === 'admin'){
    const projects = await Project.find({ CollegeName : user.CollegeName});
    res.render('adminDashboard', { layout: './layouts/main_home', user, projects });
  }
  
});

router.post('/update', async (req, res)=>{
  const projectid = req.body.projectid;
  const updateType = req.body.updatename;
  const username = req.body.username;
  const user = await User.findOne({ UserName: username });
  console.log(projectid)
  if(updateType === 'approve'){
    const project = await Project.findOneAndUpdate({ _id : projectid}, {Status: 'Approved'});
    
  }else if(updateType === 'decline'){
    const project = await Project.findOneAndUpdate({ _id : projectid }, { Status: 'Declined' });
  }
  const projects = await Project.find({ CollegeName: user.CollegeName });
  res.render('adminDashboard', { layout: './layouts/main_home', user, projects });
})

router.post('/newproject', async (req, res) => {
  const collegename = req.body.collegename;
  const username= req.body.username;
  const students = await User.find({CollegeName: collegename});
  res.render('newProject', { layout: './layouts/main_home', isUpdated: false, students, username});
})


router.get('/createuser', async (req, res) => {
  const user = await User.create({...req.body});
  console.log(user);
  res.render('studentDashboard', { user });
});

router.post('/createproject', async (req, res) => {
  const filtered = req.body.Students.filter((element) => {
    return element !== '';
  });
  console.log(filtered);
  req.body.Students= filtered;
  const project = await Project.create({...req.body})
  
  const projects = await Project.find({ Status: 'Approved' });
  
  const user = await User.findOne({ UserName: req.body.username });
  res.render('studentDashboard', { layout: './layouts/main_home', user, projects });
});

// router.get('/login', async (req, res) => {
//   res.render('login', {
//     layout: './layouts/login',
//   });
// });

// router.get('/login', async (req, res) => {
//   res.render('login', {
//     layout: './layouts/login',
//   });
// });

// router.get('/register', async (req, res) => {
//   res.render('register', {
//     layout: './layouts/login',
//   });
// });

router.get('/homepage', authenticateUser, async (req, res) => {
  // Get All jobs
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt').lean();
  const name = req.user.name;
  res.render('homepage', { layout: './layouts/main', jobs,  name});
});

router.post('/update', authenticateUser, async (req, res) => {
    //   console.log(req)
    const {user: { userId }} = req;

    const jobId = req.body.jobid;

    const job = await Job.findOne({_id: jobId, createdBy: userId});

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    let isUpdated = false;
    console.log(job);
    const name = req.user.name;
    res.render('update', { layout: './layouts/main', job, isUpdated, name });
});

router.get('/update', authenticateUser, async (req, res) => {
//   console.log(req);

  const jobId = req.body.jobid;

  const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  let isUpdated=false;
  console.log(job);
  res.render('update', { layout: './layouts/main', job, isUpdated });
});

router.post('/like' ,async (req,res) => {
  const userGuid = req.body.userGuid;
  const projectGuid = req.body.projectGuid;

  const isLiked = await Likes.findOne({userGuid : userGuid,projectGuid : projectGuid});

  if(isLiked)
  {
    await Likes.deleteOne({userGuid : userGuid,projectGuid : projectGuid})
  }
  else
  {
    await Likes.create({userGuid : userGuid,projectGuid : projectGuid})
  }
  res.redirect(307,
    url.format({
      pathname: '/dashboard',
      query: {
        username: userGuid
      },
    })
  );

  // const username = userGuid;
  // // console.log(username);
  // const user = await User.findOne({ UserName: username });
  // // console.log(user);
  // if (user.UserType === 'student') {
  //   const projects = await Project.find({ Status: 'Approved' });
  //   for (let i = 0; i < projects.length; i++) {
  //     projects[i].isliked = false;
  //   }

  //   const likedPost = await Likes.find({ userGuid: username });
  //   for (let i = 0; i < projects.length; i++) {
  //     for (let j = 0; j < likedPost.length; j++) {
  //       // console.log(projects[i]._id,likedPost[j].projectGuid)
  //       if (projects[i]._id == likedPost[j].projectGuid) {
  //         projects[i].isliked = true;
  //         // console.log('if here');
  //       }
  //     }
  //     // console.log('outer loop here');
  //   }
  //   // console.log(projects);
  //   res.render('studentDashboard', { layout: './layouts/main_home', user, projects });
  // } else if (user.UserType === 'admin') {
  //   const projects = await Project.find({ CollegeName: user.CollegeName });
  //   res.render('adminDashboard', { layout: './layouts/main_home', user, projects });
  // }

})

router.get('/like/:userGuid',async(req,res) => {

  const userGuid = req.params.userGuid;
  const likedPost = await Likes.find({userGuid : userGuid});
  res.send(likedPost)
})

module.exports = router;
