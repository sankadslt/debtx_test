import { Schema, model } from 'mongoose';

const serviceSchema = new Schema({
    service_type: {
        type: String, 
        required: true 
    },
    drc_service_status: {
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'Active' 
    },
    status_change_dtm: {
        type: Date, 
        required: true 
    },
    status_changed_by: {
        type: String, 
        required: true 
    }
});

const drcSchema = new Schema({
    drc_id: {
        type: Number, 
        required: true, 
        unique: true 
    },
    drc_abbreviation: {
        type: String, 
        required: true 
    },
    drc_name: {
        type: String, 
        required: true 
    },
    drc_status: {
        type: String,
        enum: ['Active', 'Inactive', 'Pending'], 
        default: 'Active' 
    },
    teli_no: {
        type: String, 
        required: true
    },
    drc_end_dat: {
        type: Date, 
        default: null
    },
    create_by: {
        type: String, 
        required: true 
    },
    create_dtm: {
        type: Date, 
        required: true 
    },
    services_of_drc: {
        type: [serviceSchema], 
        required: true 
    }
}, {
    collection: 'Debt_recovery_company', 
    timestamps: true 
});

const DRC = model('DRC', drcSchema);

export default DRC;
