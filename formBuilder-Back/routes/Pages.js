const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {isAdmin}=require("../middlewear/AuthMiddleWear");
const Page = require('../Models/PageModel');
const Form =require('../Models/FormModel')


router.post('/createPage', isAdmin, async (req, res) => {
    const { title, description, link } = req.body;
    
    try {
     
        const existingPage = await Page.findOne({ title });

        if (existingPage) {
            return res.status(400).json({ message: "A page with this title already exists. Please use a different title." });
        }

       
        const newPage = new Page({ title, description, link });
        const savedPage = await newPage.save();
        res.status(201).json({ message: "Page Created Successfully", savedPage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/getAllPages', async (req, res) => {
    try {
        const pages = await Page.find();
        res.json(pages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/UpdatePage/:id', isAdmin, async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const updatedPage = await Page.findByIdAndUpdate(
            req.params.id,
            { title, description, link },
            { new: true }
        );
        res.json(updatedPage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/DeletePage/:id', isAdmin, async (req, res) => {
    try {
        await Page.findByIdAndDelete(req.params.id);
        res.json({ message: 'Page deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/pages', async (req, res) => {
    try {
        const pages = await Page.find().populate('forms'); 
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pages' });
    }
});
router.get('/GetPageById/:pageId',async(req,res)=>
{ const pageId = req.params.pageId;
    try {
        const page = await Page.findById(pageId).populate('forms');

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching page' });
    }

})

router.post('/assignFormToPages', isAdmin, async (req, res) => {
    const { formId, pageIds } = req.body;

 
    try {
       
        if (!mongoose.Types.ObjectId.isValid(formId) || pageIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid formId or pageId(s)" });
        }

    
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

      
        const pages = await Page.find({ '_id': { $in: pageIds } });
        const foundPageIds = pages.map(page => page._id.toString());

        const notFoundPageIds = pageIds.filter(id => !foundPageIds.includes(id));
        if (notFoundPageIds.length) {
            return res.status(404).json({ message: `Some pages not found: ${notFoundPageIds.join(', ')}` });
        }

        await Promise.all(pages.map(async (page) => {
            if (!page.forms.includes(formId)) {
                page.forms.push(formId);
                await page.save();
            }
        }));

        form.pages = Array.from(new Set([...form.pages, ...pageIds]));
        await form.save();

        res.status(200).json({ message: "Form assigned to pages successfully", form, pages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;