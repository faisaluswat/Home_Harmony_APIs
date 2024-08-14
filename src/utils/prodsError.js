const fs =  require("node:fs")

const { validationResult } = require('express-validator');

module.exports = prodErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorObj = {};
        errors.errors.forEach(e => {
            errorObj[e.path] = e.msg;
        });
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

        return { validationErrors: errorObj };
    }
    return;
}