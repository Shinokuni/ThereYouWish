import React, {useEffect, useState} from 'react';
import {Image, ImageURISource, Pressable, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import styles from './style';

interface FixedHeightImageProps {
  source: ImageURISource;
  fixedHeight: number;
  onPress?: () => void;
  style?: object;
}

const FixedHeightImage = ({
  source,
  fixedHeight,
  onPress,
  style,
}: FixedHeightImageProps) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Image.getSize(
      source.uri!!,
      (width: number, height: number) => {
        setAspectRatio(width / height);
        setLoading(false);
      },
      (error: any) => {
        console.error('Error getting image size:', error);
        setLoading(false);
      },
    );
  }, [source]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, {height: fixedHeight}]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <Image
        source={source}
        height={fixedHeight}
        width={fixedHeight * aspectRatio}
        style={[styles.image, style]}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export default FixedHeightImage;
