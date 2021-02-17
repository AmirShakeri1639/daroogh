import React, { useEffect, useState } from 'react';
import { User } from '../../../../services/api';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState();

  useEffect(() => {
    async function getProfile(): Promise<any> {
      const { profile } = new User();
      const data = await profile();
      setProfileData(data);
    } 

    getProfile();
  }, [])

  return (
    <>
    { console.log('profile:', profileData) }
    PROFILE
    </>
  )
}

export default Profile;
