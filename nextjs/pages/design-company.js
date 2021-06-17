import React from 'react';
import DesignCompany from 'views/NostalgiaIndex';
import Main from 'layouts/Main';
import WithLayout from 'WithLayout';

const DesignCompanyPage = () => {
  return (
    <WithLayout
      component={DesignCompany}
      layout={Main}
    />
  )
};

export default DesignCompanyPage;
