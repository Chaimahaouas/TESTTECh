const express = require('express');
const router = express.Router();
const Form = require('../Models/FormModel');
const Submission =require('../Models/FormSubmissionModel');
const {isAdmin} = require('../middlewear/AuthMiddleWear');
const {verifyUser}=require('../middlewear/AuthMiddleWear');
const Page= require('../Models/PageModel');


router.post('/create',isAdmin,async (req, res) => {
    console.log('Received a POST request to /create');
    const form = new Form(req.body);
    try {
        const savedForm = await form.save();
        res.status(201).send(savedForm);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/submit/:pageId', verifyUser, async (req, res) => {
    const { pageId } = req.params;
    const { formData } = req.body;
  
    if (!formData) {
      return res.status(400).send({ message: 'Data is required.' });
    }
  
    const userId = req.user._id;
  
    try {
      const submission = new FormSubmission({
        user: userId,
        page: pageId,
        data: formData,
      });
  
      await submission.save();
  
      res.status(200).send({ message: 'Form submitted successfully.' });
    } catch (error) {
          console.error('Error submitting form:', error);
      res.status(500).send({ message: 'Error submitting form.', error });
    }
  });
router.get('/getAll',isAdmin, async (req, res) => {
    try {
        const forms = await Form.find();
        res.send(forms);
    } catch (err) {
        res.status(500).send(err);
    }
});


router.get('/getById/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).send('Form not found');
        res.send(form);
    } catch (err) {
        res.status(500).send(err);
    }
});


router.put('/updateform/:id', async (req, res) => {
    try {
        const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!form) return res.status(404).send('Form not found');
        res.send(form);
    } catch (err) {
        res.status(400).send(err);
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);
        if (!form) return res.status(404).send('Form not found');
        res.send(form);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;