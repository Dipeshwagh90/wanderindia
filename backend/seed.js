const mongoose = require('mongoose');
const Destination = require('./models/destination');
const Package = require('./models/package');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wanderindia';

const destinationsData = [
  {
    mockId: '1',
    name: '🏖️ Goa',
    category: 'Beach',
    description: 'A vibrant coastal paradise known for its stunning beaches, Portuguese heritage, and lively nightlife.',
    bestTimeToVisit: 'November to February',
    thingsToDo: ['Relax on beaches', 'Explore old Portuguese architecture', 'Enjoy water sports', 'Visit spice plantations'],
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29hJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D'
  },
  {
    mockId: '2',
    name: '🌴 Kerala Backwaters',
    category: 'Adventure',
    description: 'Serene backwaters offering houseboat cruises, lush greenery, and Ayurvedic treatments.',
    bestTimeToVisit: 'June to September',
    thingsToDo: ['Houseboat cruise', 'Visit tea plantations', 'Ayurvedic spa', 'Wildlife spotting'],
    rating: 4.7,
    image: 'https://www.tripsavvy.com/thmb/UoylMLyzOBPdDp34ForEiJd9m3s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-522478216-5ab12c4e3de4230036949cee.jpg'
  },
  {
    mockId: '3',
    name: '🏰 Jaipur',
    category: 'Heritage',
    description: 'The Pink City with magnificent palaces, forts, and a rich Rajasthani culture.',
    bestTimeToVisit: 'October to March',
    thingsToDo: ['Visit Amber Fort', 'Explore City Palace', 'Shop in markets', 'Camel safari'],
    rating: 4.3,
    image: 'https://res.cloudinary.com/ddjuftfy2/image/upload/f_webp,c_fill,q_auto/memphis/large/4b0a09f43660f2e1fa8d422d16e40212.jpg'
  },
  {
    mockId: '4',
    name: '🏔️ Manali',
    category: 'Mountain',
    description: 'A hill station paradise with snow-capped peaks, adventure sports, and scenic beauty.',
    bestTimeToVisit: 'March to June',
    thingsToDo: ['Trek in mountains', 'Visit Rohtang Pass', 'Paragliding', 'Hot springs'],
    rating: 4.6,
    image: 'https://static.toiimg.com/photo/msid-81672797,width-96,height-65.cms'
  },
  {
    mockId: '5',
    name: '🕌 Agra',
    category: 'Heritage',
    description: 'Home to the iconic Taj Mahal and other Mughal monuments.',
    bestTimeToVisit: 'October to March',
    thingsToDo: ['Visit Taj Mahal', 'Explore Agra Fort', 'See Fatehpur Sikri', 'Shop for marble crafts'],
    rating: 4.4,
    image: 'https://images.pexels.com/photos/602607/pexels-photo-602607.png'
  },
  {
    mockId: '6',
    name: '🌃 Mumbai',
    category: 'City',
    description: 'The bustling financial capital of India, known for Bollywood, street food, and colonial architecture.',
    bestTimeToVisit: 'October to May',
    thingsToDo: ['Visit Gateway of India', 'Explore Marine Drive', 'Bollywood tour', 'Elephanta Caves'],
    rating: 4.2,
    image: 'https://t4.ftcdn.net/jpg/01/46/43/87/360_F_146438747_3XYwVkfnYZuukBZYmDM8xeoqENzyhAqa.jpg'
  },
  {
    mockId: '7',
    name: '🏛️ Delhi',
    category: 'Heritage',
    description: 'The historic capital with ancient forts, mosques, and bustling markets.',
    bestTimeToVisit: 'October to March',
    thingsToDo: ['Visit Red Fort', 'Explore India Gate', 'Shop in Chandni Chowk', 'Humayun\'s Tomb'],
    rating: 4.1,
    image: 'https://clubmahindra.gumlet.io/blog/images/Red-Fort-Delhi-resized.jpg?w=376&dpr=2.6'
  },
  {
    mockId: '8',
    name: '❄️ Kashmir',
    category: 'Mountain',
    description: 'Paradise on earth with stunning valleys, lakes, and houseboats.',
    bestTimeToVisit: 'April to October',
    thingsToDo: ['Visit Dal Lake', 'Shikara ride', 'Gulmarg skiing', 'Trek in mountains'],
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?w=800&h=600&fit=crop'
  },
  {
    mockId: '9',
    name: '🧘 Rishikesh',
    category: 'Adventure',
    description: 'The yoga capital with river rafting, temples, and spiritual retreats.',
    bestTimeToVisit: 'March to June',
    thingsToDo: ['River rafting', 'Visit Beatles Ashram', 'Yoga classes', 'Trek to waterfalls'],
    rating: 4.5,
    image: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-triveni-ghat-rishikesh-uttarakhand-2-city-hero?qlt=82&ts=1742167841959'
  },
  {
    mockId: '10',
    name: '💎 Udaipur',
    category: 'Heritage',
    description: 'The City of Lakes with beautiful palaces and lakes.',
    bestTimeToVisit: 'October to March',
    thingsToDo: ['Visit City Palace', 'Boat ride on Pichola Lake', 'Explore Jagdish Temple', 'Havelis tour'],
    rating: 4.4,
    image: 'https://www.oyorooms.com/travel-guide/wp-content/uploads/2021/08/BlogImage-24Aug_Udaipur_Image-10-1.jpg'
  },
  {
    mockId: '11',
    name: '🙏 Varanasi',
    category: 'Spiritual',
    description: 'The spiritual capital with ancient temples and the sacred Ganges River.',
    bestTimeToVisit: 'October to March',
    thingsToDo: ['Ganges boat ride', 'Visit Kashi Vishwanath Temple', 'Morning aarti', 'Explore old city'],
    rating: 4.3,
    image: 'https://t4.ftcdn.net/jpg/00/14/92/13/360_F_14921374_cxnqH33QN7vKSTDyvrNZRCHqyWXiBBWd.jpg'
  },
  {
    mockId: '12',
    name: '🌊 Andaman Islands',
    category: 'Beach',
    description: 'Tropical paradise with pristine beaches, coral reefs, and marine life.',
    bestTimeToVisit: 'October to May',
    thingsToDo: ['Scuba diving', 'Visit Cellular Jail', 'Island hopping', 'Snorkeling'],
    rating: 4.6,
    image: 'https://plus.unsplash.com/premium_photo-1661962958462-9e52fda9954d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YW5kYW1hbnxlbnwwfHwwfHx8MA%3D%3D'
  }
];

const packagesData = [
  {
    name: '🏖️ Goa Beach Getaway',
    mockDestinationId: '1',
    price: 15000,
    duration: '5 Days / 4 Nights',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop&q=80',
    inclusions: ['Flights', 'Hotels', 'Meals', 'Sightseeing'],
    itinerary: [
      { day: 1, description: 'Arrival in Goa, transfer to hotel' },
      { day: 2, description: 'Beach day and water sports' },
      { day: 3, description: 'Explore North Goa' },
      { day: 4, description: 'Visit spice plantations' },
      { day: 5, description: 'Departure' }
    ]
  },
  {
    name: '🚤 Kerala Houseboat Cruise',
    mockDestinationId: '2',
    price: 25000,
    duration: '7 Days / 6 Nights',
    image: 'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    inclusions: ['Flights', 'Houseboat', 'Meals', 'Guide'],
    itinerary: [
      { day: 1, description: 'Arrival in Kochi' },
      { day: 2, description: 'Transfer to Alleppey' },
      { day: 3, description: 'Houseboat cruise begins' },
      { day: 4, description: 'Explore backwaters' },
      { day: 5, description: 'Visit tea plantations' },
      { day: 6, description: 'Cultural shows' },
      { day: 7, description: 'Departure' }
    ]
  },
  {
    name: 'Jaipur Heritage Tour',
    mockDestinationId: '3',
    price: 12000,
    duration: '4 Days / 3 Nights',
    image: 'https://res.cloudinary.com/ddjuftfy2/image/upload/w_800,h_600,c_fill,q_auto/memphis/large/4b0a09f43660f2e1fa8d422d16e40212.jpg',
    inclusions: ['Train', 'Hotels', 'Meals', 'Guide'],
    itinerary: [
      { day: 1, description: 'Arrival in Jaipur' },
      { day: 2, description: 'Visit Amber Fort and City Palace' },
      { day: 3, description: 'Explore markets and Jantar Mantar' },
      { day: 4, description: 'Departure' }
    ]
  },
  {
    name: '🏔️ Manali Adventure Trip',
    mockDestinationId: '4',
    price: 18000,
    duration: '6 Days / 5 Nights',
    image: 'https://static.toiimg.com/photo/msid-81672797,width-800,height-600.cms',
    inclusions: ['Flights', 'Hotels', 'Meals', 'Activities'],
    itinerary: [
      { day: 1, description: 'Arrival in Manali' },
      { day: 2, description: 'Acclimatization and local sightseeing' },
      { day: 3, description: 'Rohtang Pass visit' },
      { day: 4, description: 'Trekking and adventure sports' },
      { day: 5, description: 'Solang Valley' },
      { day: 6, description: 'Departure' }
    ]
  },
  {
    name: '🕌 Agra Taj Mahal Tour',
    mockDestinationId: '5',
    price: 10000,
    duration: '3 Days / 2 Nights',
    image: 'https://images.pexels.com/photos/602607/pexels-photo-602607.png?w=800&h=600&fit=crop',
    inclusions: ['Train', 'Hotels', 'Meals', 'Entry tickets'],
    itinerary: [
      { day: 1, description: 'Arrival in Agra' },
      { day: 2, description: 'Visit Taj Mahal and Agra Fort' },
      { day: 3, description: 'Departure' }
    ]
  },
  {
    name: '🌃 Mumbai City Explorer',
    mockDestinationId: '6',
    price: 20000,
    duration: '5 Days / 4 Nights',
    image: 'https://t4.ftcdn.net/jpg/01/46/43/87/360_F_146438747_3XYwVkfnYZuukBZYmDM8xeoqENzyhAqa.jpg?w=800&h=600&fit=crop',
    inclusions: ['Flights', 'Hotels', 'Meals', 'Sightseeing'],
    itinerary: [
      { day: 1, description: 'Arrival in Mumbai' },
      { day: 2, description: 'Gateway of India and Marine Drive' },
      { day: 3, description: 'Bollywood tour and Elephanta Caves' },
      { day: 4, description: 'Street food and markets' },
      { day: 5, description: 'Departure' }
    ]
  },
  {
    name: '🏛️ Delhi Heritage Tour',
    mockDestinationId: '7',
    price: 14000,
    duration: '4 Days / 3 Nights',
    image: 'https://clubmahindra.gumlet.io/blog/images/Red-Fort-Delhi-resized.jpg?w=800&h=600&fit=crop',
    inclusions: ['Flights', 'Hotels', 'Meals', 'Guide'],
    itinerary: [
      { day: 1, description: 'Arrival in Delhi' },
      { day: 2, description: 'Red Fort and Chandni Chowk' },
      { day: 3, description: 'India Gate and Humayun\'s Tomb' },
      { day: 4, description: 'Departure' }
    ]
  },
  {
    name: '❄️ Kashmir Valley Tour',
    mockDestinationId: '8',
    price: 30000,
    duration: '7 Days / 6 Nights',
    image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?w=800&h=600&fit=crop',
    inclusions: ['Flights', 'Houseboat', 'Meals', 'Guide'],
    itinerary: [
      { day: 1, description: 'Arrival in Srinagar' },
      { day: 2, description: 'Dal Lake and Shikara ride' },
      { day: 3, description: 'Gulmarg and skiing' },
      { day: 4, description: 'Pahalgam trek' },
      { day: 5, description: 'Sonmarg valley' },
      { day: 6, description: 'Local culture' },
      { day: 7, description: 'Departure' }
    ]
  },
  {
    name: '🧘 Rishikesh Adventure Package',
    mockDestinationId: '9',
    price: 16000,
    duration: '5 Days / 4 Nights',
    image: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-triveni-ghat-rishikesh-uttarakhand-2-city-hero?wid=800&hei=600&fit=stretch,0',
    inclusions: ['Train', 'Hotels', 'Meals', 'Activities'],
    itinerary: [
      { day: 1, description: 'Arrival in Rishikesh' },
      { day: 2, description: 'River rafting' },
      { day: 3, description: 'Yoga and meditation' },
      { day: 4, description: 'Beatles Ashram and waterfalls' },
      { day: 5, description: 'Departure' }
    ]
  },
  {
    name: '💎 Udaipur Lakes Tour',
    mockDestinationId: '10',
    price: 13000,
    duration: '4 Days / 3 Nights',
    image: 'https://www.oyorooms.com/travel-guide/wp-content/uploads/2021/08/BlogImage-24Aug_Udaipur_Image-10-1.jpg?w=800&h=600&fit=crop',
    inclusions: ['Flights', 'Hotels', 'Meals', 'Boat ride'],
    itinerary: [
      { day: 1, description: 'Arrival in Udaipur' },
      { day: 2, description: 'City Palace and Pichola Lake' },
      { day: 3, description: 'Jag Mandir and local markets' },
      { day: 4, description: 'Departure' }
    ]
  },
  {
    name: 'Varanasi Spiritual Journey',
    mockDestinationId: '11',
    price: 11000,
    duration: '4 Days / 3 Nights',
    image: 'https://www.agoda.com/wp-content/uploads/2024/06/ancient-Varanasi-city-architecture-featured-1244x700.jpg',
    inclusions: ['Flights', 'Hotels', 'Meals', 'Boat ride'],
    itinerary: [
      { day: 1, description: 'Arrival in Varanasi' },
      { day: 2, description: 'Ganges boat ride and morning aarti' },
      { day: 3, description: 'Temples and old city exploration' },
      { day: 4, description: 'Departure' }
    ]
  },
  {
    name: 'Andaman Beach Paradise',
    mockDestinationId: '12',
    price: 35000,
    duration: '7 Days / 6 Nights',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80',
    inclusions: ['Flights', 'Hotels', 'Meals', 'Activities'],
    itinerary: [
      { day: 1, description: 'Arrival in Port Blair' },
      { day: 2, description: 'Cellular Jail and local sightseeing' },
      { day: 3, description: 'Havelock Island transfer' },
      { day: 4, description: 'Scuba diving and snorkeling' },
      { day: 5, description: 'Radhanagar Beach' },
      { day: 6, description: 'Island hopping' },
      { day: 7, description: 'Departure' }
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected! Clearing existing collections...');
    
    await Destination.deleteMany({});
    await Package.deleteMany({});
    console.log('Collections cleared.');

    const mockIdToMongoId = {};
    console.log('Seeding destinations...');
    for (const dest of destinationsData) {
      const destination = new Destination({
        name: dest.name,
        category: dest.category,
        description: dest.description,
        bestTimeToVisit: dest.bestTimeToVisit,
        thingsToDo: dest.thingsToDo,
        rating: dest.rating,
        image: dest.image
      });
      const savedDest = await destination.save();
      mockIdToMongoId[dest.mockId] = savedDest._id;
      console.log(`- Created Destination: ${savedDest.name} (${savedDest._id})`);
    }

    console.log('Seeding packages...');
    for (const pkg of packagesData) {
      const mongoDestId = mockIdToMongoId[pkg.mockDestinationId];
      if (!mongoDestId) {
        console.error(`Warning: No destination found for mock ID ${pkg.mockDestinationId}`);
        continue;
      }
      
      const tourPackage = new Package({
        name: pkg.name,
        destination: mongoDestId,
        price: pkg.price,
        duration: pkg.duration,
        image: pkg.image,
        inclusions: pkg.inclusions,
        itinerary: pkg.itinerary
      });
      const savedPkg = await tourPackage.save();
      console.log(`- Created Package: ${savedPkg.name} (${savedPkg._id})`);
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seed();
