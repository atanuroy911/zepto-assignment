import React from 'react';
import FontUpload from './FontUpload';
import FontList from './FontList';
import FontGroup from './FontGroup';

const Home = () => {
    return (
        <div>
            <h1 className='text-center w-full p-5'>Upload Fonts</h1>
            <FontUpload></FontUpload>
            <FontList></FontList>
            <FontGroup></FontGroup>
        </div>
    );
};

export default Home;