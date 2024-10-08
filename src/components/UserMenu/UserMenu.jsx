import { useDispatch, useSelector } from 'react-redux';
import c from './UserMenu.module.css';
import { logOut } from '../../redux/authSlice';

export const UserMenu = () => {
  const login = useSelector((state) => state.auth.login);
  const dispath = useDispatch();
  return (
    <div>
      {login}
      <button onClick={() => dispath(logOut())} className={c.buttonlogout}>
        Log Out
      </button>
    </div>
  );
};
