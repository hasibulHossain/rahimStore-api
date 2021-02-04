// const { validationResult } = require('express-validator');

// local import
const Product = require('../models/product');
const dltImage = require('../util/dltImage');
const errMessage = require('../util/errMss');

const defaultImgUrl = "empty";

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.status(200).json({
                message: 'product fetch successfully',
                products: products
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .then(product => {
            res.status(200).json({
                message: 'product fetch successfully',
                product: product
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.addProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const expiryDate = req.body.expiryDate;
    let file = req.file;

    if (!file) {
        file = defaultImgUrl;
    }

    const product = new Product({
        name: name,
        price: price,
        expiryDate: expiryDate,
        imageUrl: file === defaultImgUrl ? defaultImgUrl : file.path.split('uploads')[1],
    });

    product.save()
        .then(product => {
            if (!product) {
                errMessage('Adding product failed!', 404);
            }


            res.status(201).json({
                message: 'product created successfully',
                product: product
            })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId)

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'product could not found'
                })
            }

            if (defaultImgUrl !== product.imageUrl) {
                dltImage(product.imageUrl);
            }

            return product.delete();
        })
        .then(_ => {
            res.status(200).json({
                message: 'Deleted product successfully.'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.editProduct = (req, res, next) => {
    const productId = req.params.productId;

    const name = req.body.name;
    const price = req.body.price;
    const expiryDate = req.body.expiryDate;
    let imageUrl = req.body.image;

    const file = req.file;

    if (file) {
        imageUrl = file.path.split('uploads')[1];
    }

    Product.findById(productId)
        .then(product => {
            if (!product) {
                errMessage('Post could not found', 404);
            }

            if (imageUrl !== product.imageUrl) {
                dltImage(product.imageUrl)
            }

            product.name = name;
            product.price = price;
            product.expiryDate = expiryDate;
            product.imageUrl = imageUrl;

            return product.save()
        })
        .then(updatedProduct => {
            res.status(200).json({
                message: 'Product updated successfully', product: updatedProduct
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });
}