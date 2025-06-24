import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logout())
      window.localStorage.removeItem('token')
    }
  };


  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link to={'/'} className={styles.logo} >
            <div>Full stack blog</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                {userData  && (
                  <span>Hello, {userData.fullName}</span>
                )}
                
                <Link to="/add-post">
                  <Button variant="contained">Write article</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Create account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
