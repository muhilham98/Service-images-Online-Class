const mongoose = require("mongoose");
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');
const base64Img = require('base64-img');
const isBase64 = require('is-base64');
const  Validator  = require('fastest-validator');

const validator = new Validator();


module.exports = {
    addImages: async (req,res) => {

        const validate = validator.validate(req.body, {
            name: 'string|empty:false',
        });

        if(validate.length) {
            return res.status(400).json({
                status:'error',
                message: validate
            });
        };
        const { name, image } = req.body;
        const nameToLowerCase = name.toLowerCase();
        //console.log(nameToLowerCase);
        if(!isBase64(image,{ mimeRequired:true })){
            return res.status(400).json({
                status: 'error',
                message: 'invalid base64 (mime required)'
            })
        }
       
        base64Img.img(image, './public/images', `${nameToLowerCase}-${Date.now()}`, async (err,filepath) => {
            if(err){
                return res.status(400).json({
                    status: 'error', 
                    message: err.message
                });
            }
            const filename = filepath.split("\\").pop().split("/").pop();
            const data = await Image.create({
                name: nameToLowerCase,
                imageUrl: `images/${filename}`
            });
            return res.json({
                status: 'success',
                message: 'add image successfully',
                data: {
                    _id: data._id,
                    name: nameToLowerCase,
                    imageUrl: `${req.get('host')}/${data.imageUrl}`,
                    created_at : data.created_at
                }
            });
        })

    },

    getImages: async(req,res) => {
        const { name } = req.query;
        //console.log(name);
        if(name){
            const data = await Image.find({ name: { $regex: '.*' + name.toLowerCase() + '.*' }});
            
            const mappedData = data.map((m)=>{
                m.imageUrl = `${req.get('host')}/${m.imageUrl}`;
                return m;
            });
    
            return res.json({
                status :'success',
                message: 'get images successfully',
                data: mappedData,
            })
        }

        const data = await Image.find();
        
        const mappedData = data.map((m)=>{
            m.imageUrl = `${req.get('host')}/${m.imageUrl}`;
            return m;
        });

        return res.json({
            status :'success',
            message: 'get all images successfully',
            data: mappedData,
        })
    },

    deleteImages: async(req,res) => {

        const { id } = req.params;

        const validUserId = mongoose.Types.ObjectId.isValid(id);
        if(!validUserId){
            return res.status(400).json({
                status: 'error',
                message: 'invalid id'
            });
        }
        
        const data = await Image.findOne({ _id: id });

        // const id2 = mongoose.Types.ObjectId(id);
        // console.log(typeof id2);


        if(!data){
            return res.status(404).json({ 
                status: 'error', 
                message: 'image not found or not exist'
            });
        }
        await fs.unlink(path.join(`public/${data.imageUrl}`), async(err) => {
            if(err){
                return res.status(400).json({ 
                    status: 'error', 
                    message: err.message
                });
            }
            await data.remove();
            return res.json({
                status: 'success',
                message: 'image deleted successfully'
            })
        });      
            
    }
}