export default function ErrorBoundary(){
  return (
      <div className='h-screen w-screen bg-gradient-[-45deg] from-eggblue to-slategray'>
        <div className='h-full w-full flex justify-center items-center'> Server Error: 404 </div>        
      </div>      
  );
}
