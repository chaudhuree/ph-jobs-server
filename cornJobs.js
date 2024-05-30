const corn = require('node-cron')
const Jobs = require('./models/Jobs')
const User = require('./models/User')
const sendEmailFromGmail = require('./sendEmail')

// it will run every 6 hours to send email to all users except the recruiter about the job created in the last 6 hours 
const job = corn.schedule('0 */6 * * *', async () => {
  console.log('running a task every 6 hours');
  
    const jobs = await Jobs.find({ createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }});
  console.log('jobs', jobs);
  
    const users = await User.find()
    
    users.forEach(user => {
        jobs.forEach(job => {
            if (job.recruiterEmail !== user.email) {

                sendEmailFromGmail(user.email, job)
                
            }
        })
    })
})

module.exports = job