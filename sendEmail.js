const nodemailer = require("nodemailer");

const sendEmailFromGmail = async (receiverEmail,job) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="background-color: #4CAF50; color: white; padding: 10px; text-align: center;">New Job Alert</h2>
      <h3>${job.jobType}: ${job.jobTitle}</h3>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.jobLocation}</p>
      <p><strong>Salary Range:</strong> ${job.salaryRange}</p>
      <p><strong>Deadline:</strong> ${new Date(job.deadline).toLocaleDateString()}</p>
      <p><strong>Job Description:</strong></p>
      <p>${job.jobDescription}</p>
      <p style="text-align: center;">
        <a href="https://chaudhuree-jobs.netlify.app/job/${job._id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Job</a>
      </p>
    </div>
  `;
  let info = await transporter.sendMail({
    from: {
      name: "Jobs",
      address: process.env.USER_EMAIL,
    },
    to: receiverEmail,
    subject: "Jobs, New Job Alert",
    html: htmlContent,
  });

};

module.exports = sendEmailFromGmail;