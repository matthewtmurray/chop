import axios from 'axios';

export const sendText = async ()=>{

    axios.post('https://rest.textmagic.com/api/v2/messages',{phones:'447547894885,447968718631,447723329726', text:'Someone\'s at the door' },{headers:{
        'x-tm-key': 'YTCcDf9u0Z2WMoXKVHcZIQYT70Cevq',
        'x-tm-username': 'Matthewmurray1'
    }});

};

