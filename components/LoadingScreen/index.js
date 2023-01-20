import PuffLoader from 'react-spinners/PuffLoader';

export default function LoadingScreen() {
  return (
    <div className='flex w-full min-h-screen h-full justify-center items-center bg-gradient-[-45deg] from-eggblue to-slategray'>
      <PuffLoader color='#0FD3BB'/>
    </div>
  );
}
