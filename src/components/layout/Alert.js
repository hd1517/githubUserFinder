import React, { useContext } from 'react';
import GithubContext from '../../context/github/githubContext';

const Alert = () => {
  const githubContext = useContext(GithubContext);
  const { alert } = githubContext;
  return (
    alert !== null && (
      <div className={`alert alert-$(alert.type)`}>
        <i className='fas fa-info-circle m'></i>
        {alert.msg}
      </div>
    )
  );
};

export default Alert;
