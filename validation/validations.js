const { check, validationResult } = require('express-validator');
const urlSchema=new mongoose.Schema({
    shortId: {
        type:String,
        required:true,
        unique:true,
    },
    redirectUrl:
    {
        type:String,
        required:true,
    },
    visitHistory: [{timestamps:{type:Number}}],
    },
    {timestamps:true}
);
const URL=mongoose.model('url',urlSchema);
module.exports=URL;
  

const { check, validationResult } = require('express-validator');

exports.taskSchemaValidation = [
    check('title').isString(),
    check('description').isString(),
    check('status').optional().isString().custom((value = 'pending') => {
        // Ensure status is either 'pending' or 'completed'
        if (!['pending', 'completed'].includes(value)) {
            throw new Error('Status must be either "pending"');
        }
        return true; // Return true if validation passed
    }),
    (req, res, next) => {
        // Set default value for status if it's not provide
        if (!req.body.status   || req.body.status==null) {
            req.body.status = 'pending';
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            next();
        }
    }
];
