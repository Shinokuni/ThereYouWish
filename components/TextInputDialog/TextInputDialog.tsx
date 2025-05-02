import React from 'react';
import {Button, Dialog, Portal, TextInput} from 'react-native-paper';

type TextInputDialogProps = {
  title: string;
  value: string;
  visible: boolean;
  onValueChange: (value: string) => void;
  onValidate: () => void;
  onDismiss: () => void;
};

const TextInputDialog = ({
  visible,
  title,
  value,
  onValueChange,
  onValidate,
  onDismiss,
}: TextInputDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode="outlined"
            value={value}
            onChangeText={onValueChange}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onValidate}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default TextInputDialog;
