export default function ServiceCard(props){

  return(
    <div className={'flex flex-col gap-2 w-[350px] h-[300px] bg-slategray p-6 rounded-2xl shadow-md'}>
      <div className={'text-2xl text-cheeseyellow'}>
        { props.title }
      </div>
      <div className='w-full h-1 bg-white rounded-2xl'> </div>

      <div className={'text-white font-light'}>
        { props.children }
      </div>
    </div>
  );
}
