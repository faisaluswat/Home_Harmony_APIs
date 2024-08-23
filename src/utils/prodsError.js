const fs = require("node:fs")

const { validationResult } = require('express-validator');

const removeProdsFiles = (req) => {
    if (req.files) {
        // if any field is invalid other then files then unlink Product image
        if (req.files.featured) {
            fs.unlink(req.files.featured[0].path, (err) => {
                if (err) {
                    console.error("Error deleting featured file:", err);
                }
            });
        }

        // if any field is invalid other then files then unlink gallery images
        if (req.files.gallery) {
            req.files.gallery.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting gallery file:", err);
                    }
                });
            });
        }
    }
}

const prodErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorObj = {};
        errors.errors.forEach(e => {
            errorObj[e.path] = e.msg;
        });

        removeProdsFiles(req);
        return { validationErrors: errorObj };
    }
    return;
}

const removeOldFiles = (req, product) => {
    if (req.files) {
        if (req.files.featured) {
            if (product.featured && (product.featured !== '/placeholders/product.jpg')) {
                fs.unlink('public' + product.featured, (err) => {
                    if (err) {
                        console.error("Error deleting product image file:", err);
                    }
                });
            }
        } if (req.files.gallery) {
            if (product.gallery.length > 0) {
                product.gallery.forEach(file => {
                    fs.unlink("public" + file, (err) => {
                        if (err) {
                            console.error("Error deleting gallery file:", err);
                        }
                    });
                });
            }
        }
    }
}

const removeProdOldFiles = (product) => {
    if (product.featured && (product.featured !== '/placeholders/product.jpg')) {
        fs.unlink('public' + product.featured, (err) => {
            if (err) {
                console.error("Error deleting product image file:", err);
            }
        });
    }
    if (product.gallery.length > 0) {
        product.gallery.forEach(file => {
            fs.unlink("public" + file, (err) => {
                if (err) {
                    console.error("Error deleting gallery file:", err);
                }
            });
        });
    }
}

module.exports = {
    prodErrors,
    removeProdsFiles,
    removeOldFiles,
    removeProdOldFiles
}