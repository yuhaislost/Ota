import mongoose from 'mongoose';

let connection = false;

export const connectToDb = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL)
    {
        console.log('MONGODB_URL not found');
    }

    if (connection)
    {
        console.log('Already connected to MongoDB');
    }

    const dbPassword= process.env.MONGODB_PASSWORD!;
    const connectionURL = process.env.MONGODB_URL?.replace('<PASSWORD>', dbPassword)!;

    try{

        await mongoose.connect(connectionURL);
        
        connection = true;

        console.log('Successfully connected to DB');

    }catch(error){
        console.log(error);
    }
}