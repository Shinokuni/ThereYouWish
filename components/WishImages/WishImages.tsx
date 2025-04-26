import {keepLocalCopy, pick, types} from '@react-native-documents/picker';
import React from 'react';
import {FlatList, View} from 'react-native';

import {IconButton, Surface} from 'react-native-paper';
import FixedHeightImage from '../FixedHeightImage/FixedHeightImage';
import style from './style';

// maybe this should be located elsehwere?
const openImagePicker = async () => {
  try {
    const files = await pick({
      allowMultiSelection: true,
      allowVirtualFiles: true, // android only
      type: [types.images],
    });

    if (files.length === 0) {
      return;
    }

    const copyResults = await keepLocalCopy({
      files: [
        {uri: files[0].uri, fileName: files[0].uri},
        ...files.slice(1).map(value => ({
          uri: value.uri,
          fileName: value.name!!,
        })),
      ],
      destination: 'documentDirectory',
    });

    return copyResults;
  } catch (err: unknown) {
    // maybe snackbar to inform the user?
    console.log(err);
  }
};

type WishImagesProps = {
  images: string[];
  onAddImages: (images: string[]) => void;
  onRemoveImage: (image: string) => void;
};

const WishImages = ({images, onAddImages, onRemoveImage}: WishImagesProps) => {
  return (
    <Surface style={style.surface}>
      <IconButton
        icon={'image-plus'}
        size={24}
        onPress={async () => {
          const selectedImages = await openImagePicker();

          if (selectedImages) {
            onAddImages(
              selectedImages
                .filter(value => value.status === 'success')
                .map(value => value.localUri),
            );
          }
        }}
      />
      {images.length > 0 && (
        <FlatList
          style={style.imageList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={newImage => newImage}
          data={images}
          renderItem={({item}) => {
            return (
              <View style={style.imageContainer}>
                <FixedHeightImage
                  style={style.image}
                  fixedHeight={150}
                  key={item}
                  source={{uri: item}}
                />

                <IconButton
                  mode="contained"
                  icon={'delete'}
                  style={style.imageDelete}
                  onPress={() => {
                    onRemoveImage(item);
                  }}
                />
              </View>
            );
          }}
        />
      )}
    </Surface>
  );
};

export default WishImages;
