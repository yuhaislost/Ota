import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commuity'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
    }
}, {timestamps: true});

const Thread = mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);

export default Thread;