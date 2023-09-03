import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({

    parentThread: {
        type: mongoose.Types.ObjectId,
        ref: 'Thread'
    },
    parentUser:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    replyThread:{
        type: mongoose.Types.ObjectId,
    },
    replyUser: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    read: {
        type: Boolean,
        default: false
    },
    action: {
        type: String,
        enum: ['R', 'L'],
        required: true,
    }
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

export default Activity;