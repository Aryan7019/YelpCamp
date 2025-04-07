const mongoose = require('mongoose');
const axios = require('axios');  
const cities = require('./cities');
const { descriptors, places } = require('./seedhelper');
const Campground = require('../models/campground'); 

mongoose.connect("mongodb+srv://aryanmittal961:Aryan7941@cluster0.5rmzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => { console.log('Database connected'); });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
   await Campground.deleteMany({}); 

const res = await axios.get('https://pixabay.com/api/', {
      params: {
         key: '47381089-640efeb36f683c26d66894093',
         q: 'camp',
         image_type: 'photo'
      }
   });
   const images = res.data.hits;   

   for (let i = 0; i < 100; i++) {

         image = images[i % images.length].webformatURL; 

         const price = Math.floor(Math.random() * 20) + 10;
         const random = Math.floor(Math.random() * cities.length);
         const randomLocation = `${cities[random].city}, ${cities[random].state}`
         
         const camp = new Campground({
            author: '677fbf64886b12b6d44a46d8',
            location: randomLocation,
            geometry: {
               type: "Point",
               coordinates: [cities[random].longitude,cities[random].latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            images: [{url: image , filename: 'xyz'}],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque ab dolores perferendis officiis facere dicta, repudiandae impedit corporis nam voluptate consequuntur animi esse, nemo eligendi obcaecati adipisci voluptatibus perspiciatis nulla?'
         });

         await camp.save();  
   }
};

seedDB();
