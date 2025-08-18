const  Product = require('../models/products.models');
const Category = require('../models/categories.models');





exports.getAllProducts= async (req, res)=> {
    try {
        const productList = await Product.find().populate('category');
        res.status(200).json(productList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProductsById = async (req,res) => {

    try {
        const product = await Product.frindById(req.params).populate('category');
        if (!product) {
            return res.status(404).json({success:false, message: "Product not found"});
        
        }
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.createProduct = async (req,res) => {
    
    try {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const newProduct = new Product({
        productName: req.body.productName,
        price: req.body.price,
        stock: req.body.stock,
        image: req.body.image,
        description: req.body.description,
        category: category._id
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
} catch (error) {
    res.status(500).json({ message: error.message });
}}



exports.updateProduct = async (req,res) =>{
    try{
        const category = await Product.findByIdAndUpdate( req.params.category);
        if (!category){
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json(product);

    }catch(error){
        res.status(500).json({message: error.message});

    }
};

exports.deleteProduct = async (req,res) => {
    try {
        const deletedproduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedproduct){
            return res.status(404).json({success: false, message: 'Product not found '});

        }
        res.status(200).json({success: true, message: 'Product deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}