import React from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

type AlertDialogProps = {
  title: string;
  text: string;
  visible: boolean;
  onDismiss?: () => void;
  onValidate?: () => void;
};

const AlertDialog = ({
  title,
  text,
  visible,
  onDismiss,
  onValidate,
}: AlertDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge">{text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {onDismiss && <Button onPress={onDismiss}>Cancel</Button>}
          {onValidate && <Button onPress={onValidate}>Validate</Button>}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AlertDialog;
