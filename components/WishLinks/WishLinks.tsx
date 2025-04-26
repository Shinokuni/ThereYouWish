import React from 'react';
import {Linking, View} from 'react-native';
import {
  HelperText,
  IconButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Icon from '@react-native-vector-icons/material-design-icons';

import style from './style';

type WishLinksProps = {
  links: URL[];
  linkValue: string;
  isLinkError: boolean;
  onLinkValueChange: (value: string) => void;
  onAddLink: (link: string) => void;
  onRemoveLink: (link: URL) => void;
};

const WishLinks = ({
  links,
  linkValue,
  isLinkError,
  onLinkValueChange,
  onAddLink,
  onRemoveLink,
}: WishLinksProps) => {
  const theme = useTheme();

  return (
    <Surface style={style.surface}>
      <View>
        <TextInput
          value={linkValue}
          onChangeText={onLinkValueChange}
          placeholder={'Add link...'}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          cursorColor={theme.colors.primary}
          style={style.baseInput}
          returnKeyType="next"
          left={<TextInput.Icon icon="link-plus" />}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={() => {
                onAddLink(linkValue);
              }}
            />
          }
        />

        {isLinkError && (
          <HelperText type={'error'} visible={isLinkError}>
            Entered value is not a valid URL
          </HelperText>
        )}
      </View>

      {links.length > 0 &&
        links.map(newLink => {
          return (
            <View key={newLink.toString()} style={style.linkItem}>
              <View style={style.hostContainer}>
                <Icon name="link" size={24} />
                <Text
                  variant={'titleMedium'}
                  style={{...style.host, color: theme.colors.primary}}
                  onPress={() => {
                    Linking.openURL(newLink.toString());
                  }}>
                  {newLink.host}
                </Text>
              </View>
              <IconButton
                icon={'delete'}
                size={24}
                onPress={() => {
                  onRemoveLink(newLink);
                }}
              />
            </View>
          );
        })}
    </Surface>
  );
};

export default WishLinks;
