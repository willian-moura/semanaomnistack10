
const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({github_username});

        if (!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const {name = login, avatar_url, bio} = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        } 
            
        return response.json(dev);
    },
    async index(request, response){
        const devs = await Dev.find();
        return response.json(devs);
    },
    async update(request, response){
        const {github_username, techs, latitude, longitude, name, avatar_url, bio } = request.body; 

        let dev = await Dev.findOne({github_username});
        
        if (dev){
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
            
            if(techsArray) dev.techs = techsArray;
            if(name) dev.name = name;
            if(avatar_url) dev.avatar_url = avatar_url;
            if(bio) dev.bio = bio;
            dev.location = location;

            dev = await dev.save()
        }
        else {
            return response.json({message: "Dev does not exist"});
        }

        return response.json(dev)
    },
    async destroy(request, response){
        const {github_username} = request.query;
        const dev = await Dev.findOne({github_username});
        if(dev){
            await Dev.deleteOne({github_username});
            console.log(`${dev.github_username} deleted`);
        }
        else{
            return response.json({message: `${github_username} does not exist`});
        }
        
        return response.json({message: `${dev.github_username} deleted`});
    }
    //nome, avatar, bio, localização, techs
}