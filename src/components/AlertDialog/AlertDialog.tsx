import React from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

type AlertDialogProps = {
  title: string;
  text: string;
  visible: boolean;
  onDismiss: () => void;
};

const AlertDialog = ({title, text, visible, onDismiss}: AlertDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge">{text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AlertDialog;
