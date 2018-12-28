const express         = require("express"),
app                   = express(),
ejsLint               = require('ejs-lint'),
mongoose              = require("mongoose"),
bodyParser            = require("body-parser"),
passport              = require('passport'),
Tour                  = require('./lib/models/tour'),
User                  = require('./lib/models/user'),
methodOverride        = require('method-override'),
nodemailer            = require('nodemailer'),
{google}              = require('googleapis'),
email                 = require('./lib/routes/email.js'),
index                 = require('./lib/routes/admin.js'),
LocalStrategy         = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose'),
indexRoutes           = require('./lib/routes/index.js'),
adminRoutes           = require('./lib/routes/admin.js'),
emailRoutes           = require('./lib/routes/email.js');


// using modules and adding middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(require('express-session')({
  secret: "nakai resort is a great place to stay",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(adminRoutes);
app.use(emailRoutes);


// connect to database
// mongoose.connect('mongodb://localhost/bltravel_tour', { useNewUrlParser: true});
mongoose.connect('mongodb://bltravelt:Tan77772911@ds125574.mlab.com:25574/bltravelt', { useNewUrlParser: true});

//

// dummy data and using the data to create database
var tours = [
  {
    date: "11/30/2018",
    thumbnail: "https://i.imgur.com/GM8019G.jpg",
    title: "The Thakhaek Loop",
    categories: ["Trekking", "Adventure"],
    locations: ["Vientiane", "Luang Prabang", "thakhaek"],
    generalDescription: "<p>The <b>Thakhaek loop</b> has it all, breathtaking landscapes, impressive waterfalls and a labyrinth of cave systems. You’ll never want to leave! If you want an off-the-beaten-track experience don’t look any further. By taking a private tour, you have the unique opportunity to truly take in the amazing scenery, get a taste of the local culture and experience the best of this area.</p><p>The Thakhaek Loop is a 450km route that boasts breathtaking views, amazing natural wonders and stunning scenery. High towering limestone mountains, mysterious caves, lakes and rivers along the way are just some of the stops that await you. You will get to interact with the local community in the area while immersing yourself in their lifestyle and rich culture.</p><p>Due to the challenging nature of the loop, it has become a must do activity for travelers looking to satisfy their thirst for adventure. It is usually done by driving a motorbike but given the condition of the road and the unpredictable weather, it is not an easy journey. That is why we have created a tailor made tour package, fit to give you the same thrilling experience without the fuss and with added comfort. We have come up with a flexible itinerary to make sure that you get the most out of the tour.</p> <p>All of the stops along the way are equally stunning in their own way. If you are especially impressed by any of the amazing spots and you wish to stay longer, be sure to tell your guide and they will be happy to oblige. Included in the package are accomodation, anglish Speaking Guide, private air conditioned minivan, admmission fees, breakfast & lunch, drinking water. Excluded from the tour package are: Souverniers, Other drinks (water is free)</p>",
    duration: 4,
    dayInfo:
    [
      {
        day: 1,
        title: "Explore the mysterious limestone caves",
        route: "Bhudda Cave-Xieng Lap Cave-Tham Sa Pha In Cave-Tham Nang Ene Cave",
        distance: 14,
        description: "<p>Pick-up: You will be pick up at you hotel after your breakfast between 8:30 – 9:00 AM. Get your cameras ready, the tour will begin at some of the most enchanting caves along the Thakhaek loop: <p><b>Bhudda Cave</b> - This mysterious cave houses several Buddha statues ranging in sizes. Discovered less than 15 years ago in 2004.</p> This now well known cave has since become popular with both locals and tourists.</p><p><b>Xieng Lap Cave</b> - Inside the cave is an underground lake where you can refresh and beat the heat.</p> <p><b>Tham Sa Pha</b> - In Cave One of the most quiet caves. This place will give you silence and calmness for a nice relaxing rest while enjoying the surrounding environment.</p><p><b>Lunch</b> - At a local restaurant</p><p><b>Tham Nang Ene Cave</b> - The largest of all the caves. It is well lit and maintained with stairs to guide you for safety and convenience.</p><p><b>Afternoon</b>: Arrive at <b>Nakai Resort</b>, a picturesque <b>lakeside accommodation</b>. Here you can enjoy a game of <b>petanque</b> with a complimentary local cocktail or refresh yourself with a swim in the lake and a Beer Lao at the <b>lakeside bar</b>.</p>",
        imageamount: 3,
        images:
        [
          {
            title: "Bhudda Cave",
            description: "Beautiful see-through water in the Bhudda Cave, Thakhaek",
            link:"https://i.imgur.com/N8a3KBA.jpg"
          },
          {
            title: "Xieng Lap Cave",
            description: "Xieng Lap Cave, A birthday party ?",
            link: "https://i.imgur.com/Mx2TAJa.jpg"
          },
          {
            title: "Tham Sa Pha In Cave",
            description: "Light reflecting buautifully from crystal clear water in Tham Sa Pha In Cave",
            link: "https://i.imgur.com/ZQfJ5mG.png"
          }
        ]
      },
      {
        day: 2,
        title: "Discover everything Nakai has to offer",
        route: "Nakai-Song Sou Waterfall-Sunset Tour",
        distance: 16,
        description: "<p><b>Morning</b> - Start your day with a delicious complimentary breakfast. You will need your energy for a day packed full of activities.</p> <p>First you will enjoy a <b>boat trip</b> out on the lake and try your luck at catching a fish.</p> <p><b>Lunch</b> - Next stop is <b>Song Sou Waterfall</b>, a must see in Nakai. Here you will feast on some mouthwatering <b>BBQ for lunch</b>, a traditional local cuisine. Have a go a jumping off the 4m high rock into the water and climb the rock terraces to find your own private swimming hole.</p> <p><b>Afternoon</b> - This evening be mesmerized by an infamous Laos Sunset on our Sunset Tour.</p>",
        imageamount: 3,
        images:
        [
          {
            title: "river somewhere in Nakai",
            description: "Ready to try your luck and catch a fish?",
            link:"https://i.imgur.com/X40gPyJ.jpg"
          },
          {
            title: "Song Sou Waterfall",
            description: "Mesmerizing flowing water at the Song Sou Waterfall",
            link: "https://i.imgur.com/G7m3FMj.jpg"
          },
          {
            title: "Sunset Tour",
            description: "Beautiful sun setting behind the mountain, on the road @the sunset tour",
            link: "https://i.imgur.com/LrPLbui.jpg"
          }

        ]
      },
      {
        day: 3,
        title: "Relaxing day at Cool Springs",
        route: "Nakai Resort-Dragon Cave-Cool Springs",
        distance: 25,
        description: "<p><b>Morning</b> - Complimentary breakfast before departing Nakai Resort. Make sure your camera has a full battery charge today.</p><p>Stop at <b>Dragon Cave</b> a dramatic, deep and quiet place that was used as a refuge by locals during the Indochina War. Look out for the rocky dragon in the main cavern for which the cave is named.</p><p><b>Lunch</b> - Enjoy a picnic next to the <b>Cool Springs lagoon</b>.</p><p>Another must see on the Thakhaek loop. The dirt road to the lagoon is challenging but well worth it when you see the crystal clear bright blue water that awaits you.</p><p><b>Afternoon</b> - There are two main viewpoints with breathtaking scenery between Cool Springs and your accommodation but if you want the driver to slow or stop at any point to take a photo, don’t hesitate to ask!<p/>",
        imageamount: 3,
        images:
        [
          {
            title: "Cool Springs",
            description: "Relaxing warm-chilly water at the Cool Springs",
            link:"https://i.imgur.com/LCa6s5v.jpg"
          },
          {
            title: "Picnic",
            description: "Picnicking around the cool Springs",
            link: "https://i.imgur.com/EE90OsW.jpg"
          },
          {
            title: "Picnic",
            description: "Picnicking around the cool springs",
            link: "https://i.imgur.com/qsvY7ff.jpg"
          }
        ]
      },
      {
        day: 4,
        title: "The famous Konglor Cave",
        route: "Konglor Cave",
        distance: 25,
        description: "<p><b>Morning</b> - Enjoy a delicious complimentary breakfast before setting off for Kong Lor Cave.</p><p>You will arrive at the entrance to <b>Konglor Cave</b>, enjoy a short walk through the forest and read some information about the history of the cave and the local villages. If you don’t have your own head torch you will be provided with one before you get on the boat that will take you through the cave.</p><p>This limestone cave is located by the <b>Hinboun River</b>. The ride through the cave is 7km, in parts the cave is up to 90 meters wide and 100 meters high! At the other end of the cave you will stop at a small village where you can enjoy a light refreshment and relax in the peaceful forest before heading back through the cave. Be sure to look out for the native wildlife inside and outside the cave.</p><p><b>Lunch</b> - Enjoy lunch at a local restaurant after your cave adventure.</p><p><b>Afternoon</b> - drive back to <b>Thakhaek</b> and recount the unforgettable memories of this amazing 4 day tour.</p>",
        imageamount: 6,
        images:
        [
          {
            title: "Hinboun River",
            description: "Boats parked at the bank of the Hiboun river",
            link: "https://i.imgur.com/YriHTLk.jpg"
          },
          {
            title: "Konglor Cave",
            description: "Man standing, and shining a light in the Konlor Cave",
            link: "https://i.imgur.com/9ZsKjF7.jpg"
          },
          {
            title: "Konglor Cave",
            description: "View around the Konlor Cave",
            link: "https://i.imgur.com/gg6lpD5.jpg"
          },
          {
            title: "Konglor Cave",
            description: "Stuck boat in the Konglor Cave",
            link: "https://i.imgur.com/xEL6aBG.jpg"
          },
          {
            title: "Stalagmites",
            description: "Beautiful stalagmites found in the Konglor Cave",
            link: "https://i.imgur.com/HnA904v.jpg"
          },
          {
            title: "Stairs",
            description: "Want to klimb?, dont worry some stairs to help you, don't slip (Konglor Cave)",
            link: "https://i.imgur.com/q2DnIGT.jpg"
          }
        ]
      }
    ],
  },
  {
    date: "12/1/2018",
    thumbnail: "https://i.imgur.com/PcqQspa.jpg",
    title: "Ho Chi Minh Trail",
    categories: ["Motrobike", "Trekking", "Adventure"],
    locations: ["Vientiane", "Paksan", "Lak Sao", "Nakai", "Bualapha", "Nongping", "Sepon", "Muang Nong", "Ta-Oy", "Ka Leum", "Sékong", "Attapeu", "Ban Kiet Ngang", "Wat Phou", "Soukhoumma", "Don Khong", "Ban Nakasang", "Khone Phapheng Falls", "Pakse"],
    generalDescription: "<p>This legendary route got it’s name from the leader of the Viet Minh Independence Movement and the President of Vietnam – Ho Chi Minh. The trail was used as a military supply line by the communist Vietnamese in the North during wartime. The famous trail runs through Laos and Cambodia and was used to move supplies to supporters in the South of Vietnam. Everything was freighted on dirt roads through dense jungle, and high mountains. Supplies such as ammunition, man-power and weapons all traveled along this road.</p><p>Despite being under constant attack by heavy bombing executed by the U.S. the infrastructure gradually improved with the years. At the beginning of the war it took around 6 months to do the trip but towards the end of the war it took only one month. This was due to the work carried out over the years. The final victory for the North of Vietnam was largely due to the ingenuity of this trail.</p><p>Nowadays, The <b>Ho Chi Minh Trail</b> is a must do for the more adventurous travelers looking for a real off-the-beaten-track adventure. And as luck would have it, it is best experienced on the back of a motorbike!</p>",
    duration: 10,
    dayInfo:
    [
      {
        day: 1,
        title: "First stop, Paksan",
        route: "Vientiane–Paksan",
        distance: 146,
        description: "<p><b>8:00am</b> - You will be collected from your accommodation and brought to base where you will be assigned your motorbike, gear up and eat breakfast before setting off for an enjoyable day of riding. The roads on Day 1 are all paved and easy going other. You will have plenty of opportunities to stop to snap a photo and re-hydrate.</p><p>Along the way enjoy a visit to <b>Wat Phabat Phonsan</b> temple and a walk around Phabat Village. You will have <b>lunch</b> in the village. From here, it is a short way up into the <b>Phou Khao Khouay</b> protected area where you will visit the magnificent <b>Tad Leuk waterfall</b>.</p><p>Tonight you will stay in comfortable accommodation in Paksan.</p>",
        imageamount: 4,
        images:
        [
          {
            title: "Easy dirt road",
            description: "On the road to paksan",
            link:"https://i.imgur.com/V0qu6af.jpg"
          },
          {
            title: "Bridge",
            description: "Crossing a briddge, used a during the vietnam war ",
            link: "https://i.imgur.com/TizXcEN.jpg"
          },
          {
            title: "Wat Phabat Phonsan Temple",
            description: "A temple in around the Phabat village",
            link: "https://i.imgur.com/7Md7Eh2.jpg"
          },
          {
            title: "Water fall",
            description: "The magnificent Tad Leuk water fall",
            link: "https://i.imgur.com/HKvsUDy.jpg"
          }
        ]
      },
      {
        day: 2,
        title: "On the road to Lak Sao, picnic, cool off and explore",
        route: "Paksan–Lak Sao",
        distance: 185,
        description: "  <p>Set of from Paksan and make your way onto the well-known <a href=''>Thakhaek Loop</a>. At midday enjoy a <b>picnic</b> and cool off at the famous <b>Cool Springs</b> (a clear blue lagoon), then be amazed by the enormous rocky cavern of the <b>Dragon Cave</b>. From here it is just a short ride to <b>Lak Sao</b> where you will stay for the night.</p>",
        imageamount: 3,
        images:
        [
          {
            title: "Cool Springs",
            description: "Clear blue lagoon, to be found somewhere around the Thakhaek",
            link:"https://i.imgur.com/VEowKpH.jpg"
          },
          {
            title: "Dragon Cave",
            description: "Enormous rocky caverns of the Dragon Cave",
            link: "https://i.imgur.com/tYKknsG.jpg"
          },
          {
            title: "road to Lak Sao",
            description: "Short ride to Lak sao",
            link: "https://i.imgur.com/nvPJ2sU.jpg"
          }

        ]
      },
      {
        day: 3,
        title: "Next Stop, Nakai",
        route: "Lak Sao–Nakai",
        distance: 70,
        description: "<p>Today is just a short ride so you can make the most of what the <b>Nakai-Nam Theun</b> protected area has to offer. After breakfast you will drive straight to Nakai, stopping by  view points on the way to take photos and hydrate.</p><p>You’ll stop at <b>Song Sou Waterfall</b> for lunch where you will feast on some mouthwatering <b>BBQ for lunch</b>, a traditional local cuisine. Jump off the 4m high rock into the water and climb the rock terraces to find your own private swimming hole.</p><p>In the afternoon choose between the activities <b>Nakai Resort</b> (your modern and homely accommodation) has on offer. These include (but are not limited to) <b>trekking</b> in the forest, <b>fishing</b> on the lake, <b>walking tours</b> around the village or if you simply want to relax, you can chill out in the <b>lakeside bar</b> with a Beer Lao.</p>",
        imageamount: 5,
        images:
        [
          {
            title: "Waterfall",
            description: "Song sou waterfall",
            link: "https://i.imgur.com/9kFNVO7.jpg"
          },
          {
            title: "Nakai Resort",
            description: "Lake at the rearside of Nakai resort",
            link:"https://i.imgur.com/M1pSqRM.jpg"
          },
          {
            title: "Nakai Resort",
            description: "Entrance of the Nakai resort",
            link: "https://i.imgur.com/gDQw0od.jpg"
          },
          {
            title: "Bar",
            description: "Lakeside bar at the Nakai resort",
            link: "https://i.imgur.com/Kckjc0f.jpg"
          },
          {
            title: "Sunset",
            description: "Sunset at the lake on the rearside of Nakai resort",
            link: "https://i.imgur.com/cI86z9H.jpg"
          }
        ]
      },
      {
        day: 4,
        title: "Eat in Bualapa and Nongping, then explore explore explore",
        route: "Nakai–Bualapha–Nongping–Xe Bang Fai Cave",
        distance: 148,
        description: "<p>Today enjoy a more challenging ride on the Ho Chi Minh trail. After breakfast you will drive from Nakai to <b>Bualapha</b> where you will stop for a bite to eat. After lunch it is a short drive to <b>Nongping village</b>, here you will jump into a kayak and float along the Xe Bang Fai River and make your way into <b>Xe Bang Fai Cave</b>. This cave is believed to be one of the largest river caves in the world. The enormous caverns reach an unbelievable 120 meters tall and 200 meters wide in parts. After your cave adventure you will spend the night in a Homestay in Bualapha.</p>",
        imageamount: 3,
        images:
        [
          {
            title: "Boat",
            description: "A boat, somewhere on a river in Bualapha",
            link: "https://i.imgur.com/JtttAZP.jpg"
          },
          {
            title: "Hut",
            description: "A hut in the Nongping village",
            link: "https://i.imgur.com/NXZKD6A.jpg"
          },
          {
            title: "Cave",
            description: "Bang Fai Cave, the largest river cave in the world",
            link: "https://i.imgur.com/kwarlSi.jpg"
          }
        ]
      },
      {
        day: 5,
        title: "Lets go camping and then challenge the Ho Chi Minh trail",
        route: "Bualapha–Sepon–Muang Nong",
        distance: 170,
        description: "<p>Get ready for some true off-road riding today! Slowly but surely you will reach Sepon where you can stop for lunch at a local restaurant. Tonight you will camp out in <b>Dong Phou Vieng</b> protected area in a place called <b>Kenglin</b>. The real highlight for today is navigating the challenging terrain of the Ho Chi Minh trail.</p>",
        imageamount: 3,
        images:
        [
          {
            title: "Sepong",
            description: "villagers in sepong and washing their clothes at the bang of a river",
            link: "https://i.imgur.com/3kuaXot.jpg"
          },
          {
            title: "Dirt biking",
            description: "Challenging the many dirt roads on the road to Ho Chi Minh",
            link: "https://i.imgur.com/ZOaIH0q.jpg"
          },
          {
            title: "Rest",
            description: "Taking a break whil taking on the dirt roads to Ho Chi Minh",
            link: "https://i.imgur.com/ffmC11P.jpg"
          }
        ]
      },
      {
        day: 6,
        title: "Stunning views and taking on bamboo bridges",
        route: "Muang Nong–Ta-Oy–Ka Leum–Sékong",
        distance: 190,
        description: "<p>Enjoy the stunning views along the way and work your way through more dirt roads and across <b>bamboo bridges</b>. This morning you will cross the most famous and largest bamboo bridge on the Ho Chi Minh trail, between Muang Nong and Ta-Oy. Stop for lunch at a local restaurant. In the afternoon, on your way into <b>Sekong</b> you will drive by the edges of the breathtaking <b>Dong Hua Sao</b> protected area. Accommodation for tonight will be in a homely guesthouse.</p>",
        imageamount: 5,
        images:
        [
          {
            title: "Dirt Roads",
            description: "Working your way through more dirt roads",
            link: "https://i.imgur.com/fiExPHe.jpg"
          },
          {
            title: "Bamboo bridge",
            description: "The largest bamboo bridge along the Ho Chi Minh Trail",
            link: "https://i.imgur.com/s5n06FC.jpg"
          },
          {
            title: "Viewing",
            description: "Stopping to enjoy the stunning views along the trail",
            link: "https://i.imgur.com/AH1ThHF.jpg"
          },
          {
            title: "Bridge",
            description: "Crossing a wooden bridge",
            link: "https://i.imgur.com/xIQD1Hd.jpg"
          },
          {
            title: "Views",
            description: "Stunning views along the Ho Chi Minh Trail",
            link: "https://i.imgur.com/2WbXO7W.jpg"
          }
        ]
      },
      {
        day: 7,
        title: "War remnants and elephants ?",
        route: "Sekong–Attapeu–Ban Kiet Ngong",
        distance: 180,
        description: "<p>This morning take in more amazing views of the <b>Dong Hua Sao</b> protected area. Look out for <b>war remnants</b> along the trail. Stop for lunch in <b>Attapeu</b> and in the afternoon make your way to <b>Ban Kiet Ngong</b> where you will spend the night at a guesthouse. Here you will get to see the resident <b>elephants</b> of the village!</p>",
        imageamount: 3,
        images:
        [
          {
            title: "Views",
            description: "Amazing views along Dong Hua Sao",
            link: "https://i.imgur.com/t8qf6wt.jpg"
          },
          {
            title: "Views",
            description: "Some more stunning views along Dong Hua Sao",
            link: "https://i.imgur.com/FbYKqkp.jpg"
          },
          {
            title: "Elepahants",
            description: "Village elephants in Ban Kiet Ngong",
            link: "https://i.imgur.com/qOV9904.jpg"
          }
        ]
      },
      {
        day: 8,
        title: "Beautiful water sunsets, unique dolphins and a world heritage site",
        route: "Ban Kiet Ngong–Wat Phou–Soukhoumma–Don Khong",
        distance: 190,
        description: "<p>Today cross the vast <b>Mekong River</b> on a local ferry to the largest of the <b>4000 islands</b>, <b>Don Khong</b>. Look out for the rare and odd looking <b>Irrawaddy dolphins</b>. One of only three freshwater dolphins in the world. On Don Khong you will visit the famous <b>Wat Phou</b>, a UNESCO World Heritage Site. Tonight enjoy comfortable accommodation at a riverside guesthouse.</p>",
        imageamount: 4,
        images:
        [
          {
            title: "Ferry",
            description: "Using a local ferry to cross the Mekong river",
            link: "https://i.imgur.com/tk6olYw.jpg"
          },
          {
            title: "Dolphins",
            description: "Rare Irrawaddy dolphins seen somewhere in the Mekong river",
            link: "https://i.imgur.com/M989gi5.jpg"
          },
          {
            title: "Wat Phou",
            description: "Wat Phou, UNESCO world heritage site",
            link: "https://i.imgur.com/zk6o3FJ.jpg"
          },
          {
            title: "Sunset",
            description: "Sunset at the Mekong river",
            link: "https://i.imgur.com/VCd4Wkh.jpg"
          }
        ]
      },
      {
        day: 9,
        title: "The last day, crazy waterfalls though",
        route: "Done Khong–Ban Nakasang–Khone Phapheng Falls–Pakse",
        distance: 220,
        description: "<p>Today will be your last day of riding. You will follow the Mekong River to <b>Ban Nakasang</b> from here you will travel to the <b>Laos-Cambodia</b> border to witness the breathtaking <b>Khone Phapheng falls</b>. After lunch you’ll be back on the road heading for your final stop on the Ho Chi Minh Trail, <b>Pakse</b>.</p>",
        imageamount: 2,
        images:
        [
          {
            title: "Sunrise",
            description: "Sunrise on the Mekong river",
            link: "https://i.imgur.com/V9hhG1A.jpg"
          },
          {
            title: "Waterfall",
            description: "Khone Phapheng waterfalls",
            link: "https://i.imgur.com/w6q4u0E.jpg"
          }
        ]
      },
      {
        day: 10,
        title: "Flying back to Vientiane",
        route: "Pakse–Vientiane(by plane)",
        distance: 220,
        description: "<p>Spend today reflecting on the adventure you have just had. Your transfer to Pakse airport will be arranged and when you arrive in Vientiane a air-con minivan will be waiting to take you to where you need to go. If you want explore the capital city, be sure to check out our <a href=''>Vientiane City Tour</a>.</p>",
        imageamount: 0,
        images:
        []
      },
    ],
  },
  {
    date: "12/02/2018",
    thumbnail: "https://i.imgur.com/EJECPK0.jpg",
    title: "Kong Lor Cave",
    categories: ["Adventure"],
    locations: ["Vientiane", "Prabhat Phonsan", "Sala Hin Boun"],
    generalDescription: "<p>On this tour we will discover some of the hidden gems of the <b>Khammouane District</b>. The highlight will be a boat trip through the truly amazing <b>Kong Lor Cave</b>, a 90 meter wide, 100 meter high and 7.5 kilometer long cavern created over thousands of years by the <b>Hin Boun river</b> tunneling through the mountain.</p><p> This trip will include: transportation, accomodation, boat trip, english speaking guide, meals, gov't tax and service charge.</p><p>Included in this tour package are: accomodation, english speaking guide, transport, gov't tax and service charge, admission fee, breakfast and lunch, drinking water.</p>",
    duration: 3,
    dayInfo:
    [
      {
        day: 1,
        title: "Pack your bags, we are going caving",
        route: "Vientiane-Prabaht Ponsan-Sala Hin Boun",
        distance: 331,
        description: "<p>After breakfast, you will be picked up from Hotel and travel south along route 13. On the way, we stop at Wat <b>Prabaht Phonsan</b>, an Ancient stupa dating back to the 15th Century. It is also home to the Ancient Buddha’s footprints, discovered in 1933, and now an important religious site in Laos.</p><p>Following lunch we continue onward into <b>Khammoune</b> province and into the mountainous area, where we stop at for viewing near <b>Khoun Kham</b>   – which offers a breathtaking look over the surrounding area.</p><p>We reach your accommodation for the night <b>Spring River Resort</b> – a traditional Lao residence built entirely in local timber, carefully decorated to match the way of life, set on the Hin boun River bank surrounded lime stone cliffs. You have the rest of the day for leisure as you see fit.</p>",
        imageamount: 3,
        images:
        [
          {
            title: "Konglor Cave",
            description: "View around the Konlor Cave",
            link:"https://i.imgur.com/gg6lpD5.jpg"
          },
          {
            title: "Stairs",
            description: "Want to klimb?, dont worry some stairs to help you, don't slip (Konglor Cave)",
            link: "https://i.imgur.com/q2DnIGT.jpg"
          },
          {
            title: "Konglor Cave",
            description: "Stuck boat in the Konglor Cave",
            link: "https://i.imgur.com/xEL6aBG.jpg"
          }
        ]
      },
      {
        day: 2,
        title: "Time to explore the Kong Lor Cave",
        route: "Sala Hin Boun-Kong Lor Cave",
        distance: 8,
        description: "<p>After breakfast at <b>Spring River Resort</b>, we continue by boat upriver to Kong <b>Lor village</b>, where you have the chance to explore before boarding a smaller boat into the famous Kong Lor Cave. We navigate through the cave, which is over 7km long and includes a spectacular cavern over 100m high. Following lunch in a remote village, on the other side of the cave, we return to Spring River Resort sometime before sunset. Overnight at <b>Spring River Resort</b>.</p>",
        imageamount: 0,
        images:
        []
      },
      {
        day: 3,
        title: "Relaxing day at Cool Springs",
        route: "Sala Hin Boun-Vientiane",
        distance: 331,
        description: "<p>Following breakfast, we set off by road to <b>Naphouak</b> before heading south by boat through some of the most spectacular gorges to be found in Southeast Asia. Along the way we make a stop for lunch and have a look at a picturesque <b>Lao Loum village</b>. Then we are picked up by car and transferred onward to Vientiane.</p>",
        imageamount: 3,
        images:
        [
          {
            title: "Konglor Cave",
            description: "Man standing, and shining a light in the Konlor Cave",
            link:"https://i.imgur.com/9ZsKjF7.jpg"
          },
          {
            title: "Stalagmites",
            description: "Beautiful stalagmites found in the Konglor Cave",
            link: "https://i.imgur.com/HnA904v.jpg"
          },
          {
            title: "Hinboun River",
            description: "Boats parked at the bank of the Hiboun river",
            link: "https://i.imgur.com/YriHTLk.jpg"
          }
        ]
      },
    ],
  },
  {
    date: "12/03/2018",
    thumbnail: "https://i.imgur.com/K643exQ.jpg",
    title: "Plain of Jars",
    categories: ["Trekking", "Adventure"],
    locations: ["Vientiane", "Phonsavanh", "Muang Khoun"],
    generalDescription: "<p>During the Secret War, untold numbers of relics were blown to bits and the scars of war are still easy to see. The jar fields are pockmarked with bomb craters a few meters deep and several meters across.</p><p>The Non-Profit Mines Advisory Group (MAG) has cleared 175 UXO including bombs, rockets, artillery shells, mortars, and paths at the four major sites. Everywhere that we take you is completely safe to walk.</p><p>There are a lot of theories for the jars existence. The most common theory is that they were used for burial ceremonies when burnt bones and teeth were found inside, however, this was never confirmed and still a mystery until now.</p>",
    duration: 3,
    dayInfo:
    [
      {
        day: 1,
        title: "Explore the mysterious limestone caves",
        route: "Vientiane–Phonsavanh",
        distance: 14,
        description: "<p><b>7:00am</b> - You will be collected from your accommodation. You will then drive to <b>Xiangkhouang province</b>, the location of the Plain of Jars and Wat Pia Wat. This district was heavily bombarded during Indochina War and a lot of the land marks you will see along the way are badly damaged from this time. On the way you will get the chance to stop at ethnic group villages. Each has their own unique culture and customs.</p><p>The highlights of today is a stop at the beautiful Nongtang Lake and then a visit to the near by Buddha Cave, that was used as a local refuge and hospital during the war. After that, you will continue on to your pre-booked accommodation for tonight.</p>",
        imageamount: 0,
        images:
        []
      },
      {
        day: 2,
        title: "Discover everything Nakai has to offer",
        route: "Plain of Jars–Muang Khoun",
        distance: 16,
        description: "<p>When you have finished your breakfast we drive off from the town and start the tour, visiting: Site <b>1, 2 & 3</b> of the <b>Plain of Jars</b>, where huge ancient stone vessels of unknown origin are scattered in about 20 locations. No one knows where the stone jars came from or who created them. The jars are known to be between 1,800 or 2,000 years old.</p><p>After the Plain of Jars, we’ll drive you to visit the <b>Wat Pia Wat temple</b> (the oldest temple in Laos) located in <b>Muang Khoun</b> (Old Xieng Khouang). This city was once was the royal capital of the <b>Phuan Kingdom</b>. In the 16th century, it was described as “a large and beautiful city whose numerous population was protected by a circle of deep ditches and by forts perched on the surrounding hills… the opulence of its sixty-two pagodas and their sparkling stupas, whose sides were covered in treasure, attracted renown from far and wide”. Although the town was heavily bombed from 1967 – 1970, a few French buildings remain along with Wat Pia Vat.</p><p>Take a short hike to the outskirts and you’ll stumble across the ancient Stupa That Foun and the nearby, <b>That Chomphet</b>. Both of which overlook the town. That Foun was built in 1576 – the same time as the original That Luang Stupa in Vientiane. The stupa was erected to cover statues of Buddha that were brought from India during a time when Buddhism was spreading in Laos. That Chomphet was built in the same way and at the same time, it was created to evoke Buddhist values: truth and charity. At the core of Buddhism is the belief that only merit-making will bring happiness, progress and prosperity. Next, we return to Phonsavanh City to stay at the hotel for the second night.</p>",
        imageamount: 0,
        images:
        []
      },
      {
        day: 3,
        title: "Relaxing day at Cool Springs",
        route: "Local Market–Vientiane",
        distance: 25,
        description: "<p>Early in the morning at 6:30am we’ll take you to visit the fascinating morning market where local villagers come to sell assorted vegetables and wild animals. After the market, we return to the hotel for breakfast. After that, we return you to your original location/onward destination.</p>",
        imageamount: 12,
        images:
        [
          {
            title: "Tat Foun",
            description: "The magnificent Tat Foun stupa (monument)",
            link:"https://i.imgur.com/SI2aDCC.jpg"
          },
          {
            title: "Bombs",
            description: "Used bombs of the US-Vietnamese found in Phonsavanh center",
            link: "https://i.imgur.com/MZjqAe5.jpg"
          },
          {
            title: "Wat Pea Wat",
            description: "Buddhist temple, Muang Khoun",
            link: "https://i.imgur.com/tqxv35J.jpg"
          },
          {
            title: "Plain Of Jars",
            description: "the highlight of the trip (one of the 52 sites), found in Phonsavanh",
            link: "https://i.imgur.com/9c3jZwm.jpg"
          },
          {
            title: "Tank",
            description: "One of the many tanks that are still at the sites as remnants of the war",
            link: "https://i.imgur.com/KQlbjVj.jpg"
          },
          {
            title: "Photo-6",
            description: "",
            link: "https://i.imgur.com/dh1xLQc.jpg"
          },
          {
            title: "Crater",
            description: "Bomb crater somewhere around phonsavanh, result of the war",
            link: "https://i.imgur.com/TDVQWvH.jpg"
          },
          {
            title: "PHOTO-8",
            description: "on the way from vangvieng",
            link: "https://i.imgur.com/0IEH4L6.jpg"
          },
          {
            title: "Phou Pha mointain",
            description: "on the way from vangvieng",
            link: "https://i.imgur.com/gE09rjA.jpg"
          },
          {
            title: "Hmong village",
            description: "village on the way from Phoukhoun to Phonsavanh",
            link: "https://i.imgur.com/Wu83pkW.jpg"
          },
          {
            title: "Photo-11",
            description: "",
            link: "https://i.imgur.com/rIXharA.jpg"
          },
          {
            title: "Bombs",
            description: "remnants of bombs used as a fence",
            link: "https://i.imgur.com/zsPUtvi.jpg"
          }
        ]
      }
    ],
  },
  {
    date: "12/03/2018",
    thumbnail: "https://i.imgur.com/E11wirF.jpg",
    title: "Nakai Fishing Tour",
    categories: ["Trekking", "Adventure", "Fishing", "Hiking", "Kayaking"],
    locations: ["Nakai", "Nahao", "Tha Lang"],
    generalDescription: "<p>This is one of our new tours, set in the recently considered protected Nakai protected area in Nahao Village. This tour is full of activities, from trekking, to boat rides, to swimming in lagoons around waterfalls, to camping to nightly ride in the dense jungle this tour is perfect for thrill seekers. But also for people who just want to relax and enjoy a few days out adventure in the forest.</p>",
    duration: 3,
    dayInfo:
    [
      {
        day: 1,
        title: "The Quest Begins  ",
        route: "Nakai-Tha Lang-Nam Theun-Nahao",
        distance: 14,
        description: "<p>8am - we meet at <b><a href='https://wwww.nakai-resort.com'>Nakai Resort</a></b>, and from there on we will take a minivan from Nakai to <b>Tha lang</b>. Once we arrive in Tha lang we then take a boat upstream to spot in the <b>Nam Theun</b> protective area for some fun activities (e.g swimming hiking, eating food). After some rest we will then move on a do some sightseeing (safari like). The boat trip will take around 3 hours depending on how many times we stop to the spot wild animals and in total we could stay around 6 hours give or take depending how long we stay at the spot. Afterwards we will go to <b>Nahao</b> and and overnight at a rural village.</p>",
        imageamount: 0,
        images:
        []
      },
      {
        day: 2,
        title: "Ooh look mom, a waterfall",
        route: "Nahao-Tad Nyim waterfall",
        distance: 16,
        description: "<p>We start the day to by taking a boat to a trekking route, the boat ride will take around one hour to a camping site. Around the camping site we can explore the area, go fishing and see wild animals (monkeys, elephants). Also, we will trek to the <b>Tad Nyim waterfall</b> where we can swim and admire the wild fauna around the area. We will then trek further to see a big tree named Mai Hing Sam. After the day of trekking sightseeing we move to another camping site where we will relax, and enjoy a relaxing camp fire dinner. Around 8o clock in the evening we will do a night safari to see more wild animals surrounding the area.</p>",
        imageamount: 0,
        images:
        []
      },
      {
        day: 3,
        title: "Time to head Back",
        route: "Nahao-Tha Lang-Nakai",
        distance: 25,
        description: "<p>Early in the morning at 6:30am we’ll take you to visit the fascinating morning market where local villagers come to sell assorted vegetables and wild animals. After the market, we return to the hotel for breakfast. After that, we return you to your original location/onward destination.</p>",
        imageamount: 11,
        images:
        [
          {
            title: "The spot 1",
            description: "One of the many spots on the trail where we will have some fun",
            link:"https://i.imgur.com/E11wirF.jpg"
          },
          {
            title: "The Spot 2",
            description: "Another one of the many spots, where we will stop and do some fun activities",
            link: "https://i.imgur.com/Cwv2bVf.jpg"
          },
          {
            title: "Waterfall",
            description: "The Tad Nyim Waterfall",
            link: "https://i.imgur.com/nTZiKAI.jpg"
          },
          {
            title: "Spot 4",
            description: "One os the many spots where we will stop and do some fun activities",
            link: "https://i.imgur.com/8Ori1lZ.jpg"
          },
          {
            title: "Spot 5",
            description: "One os the many spots where we will stop and do some fun activities",
            link: "https://i.imgur.com/BS4jNG7.jpg"
          },
          {
            title: "Big tree",
            description: "The big Mai Hing Sam tree",
            link: "https://i.imgur.com/Lck5ec4.jpg"
          },
          {
            title: "Wild flora and foun",
            description: "Wild flouwers around the area of the Tad Nyim waterfall",
            link: "https://i.imgur.com/KsemJms.jpg"
          },
          {
            title: "Spot 6",
            description: "One os the many spots where we will stop and do some fun activities",
            link: "https://i.imgur.com/xXe7RM9.jpg"
          },
          {
            title: "Spot 7",
            description: "One os the many spots where we will stop and do some fun activities",
            link: "https://i.imgur.com/qAIj3fv.jpg"
          },
          {
            title: "Children",
            description: "Smiling children from the nahao rural village",
            link: "https://i.imgur.com/Cwv2bVf.jpg"
          },
          {
            title: "Going upstream",
            description: "This is where we take the boat upstream",
            link: "https://i.imgur.com/cLXgV4e.jpg"
          }
        ]
      }
    ],
  }
]

//   Tour.create(tours, (err, tours) => {
//       if (err){
//           console.log(err);
//         } else{
//             console.log("You created new dummy database");
//           }
//         })
//
// // create new user
// User.register (new User ({username: "bltravelt" }), "Tan77772911", (err, user) => {
//   if (err){
//     console.log(err);
//   } else {
//     console.log("you created a new user");
//   }
// });

let port =  process.env.PORT || 3000;
// start up server
app.listen(port, function(){
  console.log("started server");
});
