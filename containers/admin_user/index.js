import { useQuery } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import { UserService } from '../../lib/service/UserService';

export default function UserManagementContainer(){
  const { isLoggedIn } = useAuth();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: async() => {
      const data = await UserService.listUsers();
      console.log(data);
      return data;
    },
    enabled: isLoggedIn
  });

  return (
    <div>
      <div> Article Management Container / Scene </div>
      {isLoading && <p> Loading... </p>}
      {isFetching && <p> Fetching... </p>}
      {data && data.map((user) => (
        <div key={user.id}>
	  <p> ID: { user.id }</p>
	  <p> Name: { user.first_name }</p>
        </div>
      ))}
    </div>
  );
}
