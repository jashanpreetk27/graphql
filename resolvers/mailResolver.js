const Mail = require('../models/mail');
const {addEmailQueue} = require('../services/emailqueue/producer')
const mailResolver = {
  Query: {
    getAllMails: async () => await Mail.find(),
  },
  Mutation: {
    createMail: async (_, { input }) => {
      const { sender, recipient, subject, body } = input;
      const newMail = new Mail({ sender, recipient, subject, body });
      try{
      await newMail.save();
      await addEmailQueue({ sender, recipient, subject, body })
      return newMail;
      }catch(err){
        return null;
      }
    },
 
updateMail: async (_, { input }) => {
  const { id, sender, recipient, subject, body } = input;
  try {
    const updatedMail = await Mail.findByIdAndUpdate(
      id,
      { sender, recipient, subject, body },
      { new: true }
    );
    return updatedMail;
  } catch (err) {
    return null;
  }
},
deleteMail: async (_, { id }) => {
  try {
    const deletedMail = await Mail.findByIdAndDelete(id);
    return deletedMail;
  } catch (err) {
    return null;
  }
},
},
};


module.exports = mailResolver;
