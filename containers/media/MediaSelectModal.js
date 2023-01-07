import Image from 'next/image';

import useAuth from '../../lib/hooks/Auth';
import { useMutation, useQuery } from "@tanstack/react-query";

import { UserService } from '../../lib/service/UserService';
import LoadingScreen from '../../components/LoadingScreen';

// MediaSelectModal.propTypes = {
//   setSelect: PropTypes.func,
//   onClose: PropTypes.func,
// };

export default function MediaSelectModal({ setSelect, onClose }) {
  const { isLoggedIn, userData, loading } = useAuth();

  const { data: medias, isFetching, isLoading } = useQuery({
    queryKey: ['medias'],
    queryFn: async () => {
      const data = await UserService.getUser(userData.id);
      return data.userData.medias;
    },
    enabled: isLoggedIn,
  });

  if(loading) return <LoadingScreen/>;
  if(!isLoggedIn){ return <p> Redirect here! </p>; }    

  return (
    <div className={'absolute bg-red-300'}>
      <div>
        <p> Please select one of the media </p>
        <button onClick={onClose}> Close </button>        
      </div>
      <div className='flex flex-wrap'>
        { isLoading && <p> Loading... </p> }
        { isFetching && <p> Fetching... </p> }        
        { medias && medias.map((m) => {
          return <div key={m.uid}
                      className='text-xs text-white hover:border-2 transition-all'
                      onClick={() => {
                        setSelect && setSelect(m);
                        onClose();
                      }}>
                   <Image alt={m.name} src={m.downloadURL} width={200} height={200} objectFit={'cover'}/>
                 </div>;
        })}      
      </div>

    </div>
  );
}
