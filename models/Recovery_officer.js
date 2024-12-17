import { Schema, model } from 'mongoose';

const roSchema = new Schema({
    ro_id: {
        type: Number, 
        required: true, 
        unique: true
    },
    ro_name: {
        type: String, 
        required: true 
    },
    ro_contact_no: {
        type: String,
        required: true
    },
    ro_status: {
        type: String,
        enum: ['Active', 'Inactive', 'Pending'],
        default: 'Active'
    },
    drc_name: {
        type: String, 
        required: true 
    },
    rtoms_for_ro: {
        type: [String], 
        required: true, 
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'At least one RTOM must be provided!'
        }
    },
    login_type: {
        type: String, 
        required: true 
    },
    login_user_id: {
        type: String, 
        required: true 
    },
    remark: {
        type: String, 
        required: true 
    },
}, {
    collection: 'Recovery_officer', 
    timestamps: true
});

// Create the model
const RO = model('RO', roSchema);

// Export the model
export default RO;
