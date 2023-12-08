import axios from "axios";

export const getProfile = async (profile_) => {
    try {
      const response = await axios.get('/profile/' + profile_ + '.json');
      return response.data;
    } catch (err) {
      throw new Error('Error fetching profile data');
    }
  };

  export const servSetProfile = async ({ account,name, artistName, story, twitter, profilePic, pfp }) => {

    let cover = ""
    let data_ = {
      account,
      name,
      artistName,
      story,
      twitter,
      profilePic,
      pfp,
      cover
    }
    const JSONdata = JSON.stringify(data_)
    const endpoint = '/api/setProfile'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    console.log(result)
    return result;
    // console.log(result)
  };
  
  