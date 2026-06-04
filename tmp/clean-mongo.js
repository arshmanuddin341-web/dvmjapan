const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://hassanuddintw_db_user:ZixixvDzxXtdMknw@cluster0.934a7ee.mongodb.net/car_auction_db?retryWrites=true&w=majority';

async function main() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Delete all from cars collection
    const collections = await mongoose.connection.db.collections();
    const carCollection = collections.find(c => c.collectionName === 'cars');

    if (carCollection) {
        const res = await carCollection.deleteMany({});
        console.log(`Deleted ${res.deletedCount} cars from MongoDB.`);
    } else {
        console.log('Collection "cars" not found.');
    }

    // Also check "vehicles" just in case
    const vehicleCollection = collections.find(c => c.collectionName === 'vehicles');
    if (vehicleCollection) {
        const res = await vehicleCollection.deleteMany({});
        console.log(`Deleted ${res.deletedCount} vehicles from MongoDB.`);
    }

    // Auctions
    const auctionCollection = collections.find(c => c.collectionName === 'auctions');
    if (auctionCollection) {
        const res = await auctionCollection.deleteMany({});
        console.log(`Deleted ${res.deletedCount} auctions from MongoDB.`);
    }

    await mongoose.disconnect();
    console.log('Disconnected.');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
