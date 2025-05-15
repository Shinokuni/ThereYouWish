import React, {useState} from 'react';
import {Dimensions, SafeAreaView, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {StaticScreenProps, useNavigation} from '@react-navigation/native';
import {Appbar} from 'react-native-paper';
import AutoSizeImage from '../../components/AutoSizeImage/AutoSizeImage';

import style from './style';
import {ImageZoom} from '@likashefqet/react-native-image-zoom';

type ImageViewerScreenProps = StaticScreenProps<{
  images: string[];
  index: number;
}>;

const ImageViewerScreen = ({route}: ImageViewerScreenProps) => {
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;

  const [baseIndex, setIndex] = useState(route.params.index);

  return (
    <SafeAreaView style={style.container}>
      <Appbar.Header dark={true} style={style.header}>
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          title={`${baseIndex + 1} / ${route.params.images.length}`}
        />
      </Appbar.Header>

      <View style={style.carouselContainer}>
        <Carousel
          width={width}
          loop={false}
          defaultIndex={route.params.index}
          data={route.params.images}
          onProgressChange={(offset, absolute) =>
            setIndex(Math.round(absolute))
          }
          renderItem={({index}) => (
            <ImageZoom uri={route.params.images[index]} isDoubleTapEnabled />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ImageViewerScreen;
