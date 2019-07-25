import React, { useState } from 'react';

const SoundLoader = () => {
   const [fileUrl, setFileUrl] = useState(null);
   return (
      <>
         <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
               const { files } = e.target;
               const url = URL.createObjectURL(files[0]);
               setFileUrl(url);
            }}
         />
         {fileUrl && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio
               src={fileUrl}
               controls
            />
         )}
      </>
   );
};
export default SoundLoader;
