import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import {EventEmitter} from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  getInitialSharedText(): string | null;
  clearInitialSharedText(): void;
  readonly onNewIntent: EventEmitter<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeAndroidShareIntent',
);
