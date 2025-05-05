import React from 'react';
import {ActivityIndicator, Dialog, Portal} from 'react-native-paper';

type LoadingDialogProps = {
  title: string;
  visible: boolean;
};

const LoadingDialog = ({title, visible}: LoadingDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <ActivityIndicator animating />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default LoadingDialog;
