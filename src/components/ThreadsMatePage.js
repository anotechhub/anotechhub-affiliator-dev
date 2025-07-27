// src/components/ThreadsMatePage.js
import React from 'react';
import ThreadsInputForm from './ThreadsInputForm';
import OutputSection from './OutputSection';

const ThreadsMatePage = (props) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ThreadsInputForm {...props} />
        <OutputSection {...props} outputType="threads" />
    </div>
);

export default ThreadsMatePage;