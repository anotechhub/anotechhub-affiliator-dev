// src/components/AffiliatorPage.js
import React from 'react';
import AffiliatorInputForm from './AffiliatorInputForm';
import OutputSection from './OutputSection';

const AffiliatorPage = (props) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AffiliatorInputForm {...props} />
        <OutputSection {...props} outputType="affiliator" />
    </div>
);

export default AffiliatorPage;