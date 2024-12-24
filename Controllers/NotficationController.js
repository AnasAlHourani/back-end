const { validationResult } = require('express-validator');
const Notfication = require('../Models/Norfication');

exports.create = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const {content} = req.body;
    const notfication = await Notfication.create({ content: content , admin_id: req.user.id}); 
    res.status(201).json({msg: 'Notifcation has been created successfully'});
};

exports.get = async (req,res,next)=>{
    const notfication = await Notfication.findAll();
    res.json({msg: 'The notfication:' , notfication})
};
exports.getMine = async (req,res,next)=>{
    const notfication = await Notfication.findAll({where: {admin_id: req.user.id}});
    res.json({msg: 'The notfication:' , notfication})
};

exports.update = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const { notId } = req.params;
    const notfications = await Notfication.findAll({where: {id: notId}});
    // res.json({msg: 'The notfication:' , notfication})
    if(!notfications.length){
        return res.status.json({msg:'Notfication not found'});
    }
    const { content } = req.body;
    const notfication = notfications[0];
    notfication.content = content;
    notfication.save();
    res.status(201).json({msg:'The notfication has been updated'});
};

exports.delete = async (req,res,next)=>{
    const { notId } = req.params;
    const notfications = await Notfication.findAll({where: {id: notId}});
    if(!notfications.length){
        return res.status(404).json({msg: 'The Notfication has been delted'});
    }
    const deleteNotfication = await notfications[0].destroy();
    res.status(201).json({msg: 'The Notfication has been delted'});

};