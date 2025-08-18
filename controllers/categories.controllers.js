const Category = require('../models/categories.models');

exports.createCategory = async(req,res)=>{
    try{
        const { name, icon } = req.body;
   
        if (!name){
            return res.status(400).json({ success: false, message:' Name is required'})
        }
        const existingCategory  = await Category.findOne({ name: name.trim()});
        if(existingCategory){
            return res.status(400).json({success: false, message: "Category already exists"});

        }

        const newCategory= new Category({
            name: name.trim(),
            icon: icon|| ""
        });
        const savedCategory = await newCategory.save();
        res.status(201).json({success: true, data: savedCategory});
    }catch(error){
        res.status(500).json({message: error.message});
    }

}

exports.updateCategory= async(req,res) =>{
    try {
      
        const category = await Category.findByIdAndUpdate(req.params.id)

        if (!category){
            return res.status(404).json({success: false, message: 'Category not found'});

        }
        category.name= req.body.name || category.name;
        category.icon = req.body.icon ||category.icon;


        const updatedCategory = await category.save();
        res.status(200).json({success: true,
        message : 'Category updated successfully',
        data: updatedCategory});
    }
   
     catch (error) {
        res.status(500).json({message: error.message});
    }                       


}
 exports.deleteCategory = async (req,res) =>{
    try{
        const category = await Category.findOne

        if (!category){
            return res.json({succes: false, message: ' Category does not exist'})

        }
        await Category.deleteOne({_id: req.params.id});
        res.status(200).json({success: true, message: 'Category deleted successfully'});
    }catch (err){
        res.status(500).json({message: err.message});
    }
 }
 exports.getCategory = async(req,res)=>{
 try {
    const category = await Category.findById(req.params.id)
    if (!category){
        return res.status(404).json({success: false, message:'category does not exist'})   
     }res.status(200).json({success: true, data: category});    

 }catch(err){
    res.status(500).json({message: err.message});
 }
}
exports.getAllCategories = async (req,res)=>{
    try{
        const category = await Category.find();
        res.status(200).json({success: true, data: category});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}