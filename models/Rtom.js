import { Schema, model } from 'mongoose';

const rtomSchema = new Schema({
    rtom_id: {
        type: Number, 
        required: true, 
        unique: true
    },
    rtom: {
        type: String, 
        required: true 
    },
    area_name: {
        type: String, 
        required: true
    },
    rtom_status: {
        type: String, 
        enum: ['Active', 'Inactive', 'Pending'],
        default: 'Active'
    }
}, {
    collection: 'Rtom', 
    timestamps: true
});

const RTOM = model('RTOM', rtomSchema);

export default RTOM;
