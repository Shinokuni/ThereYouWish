import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';

import style from './style';

type AutoSizeImageProps = {
  source: string;
};

const AutoSizeImage = ({source}: AutoSizeImageProps) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    Image.getSize(
      source,
      (width: number, height: number) => {
        setAspectRatio(width / height);
      },
      (error: any) => {
        console.error('Error getting image size:', error);
      },
    );
  }, [source]);

  return (
    <Image
      source={{uri: source}}
      style={{
        ...style.image,
        aspectRatio: aspectRatio,
      }}
      resizeMode="contain"
    />
  );
};

export default AutoSizeImage;
