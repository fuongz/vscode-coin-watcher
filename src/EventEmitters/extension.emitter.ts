import { EventEmitter } from 'events'
import { statusBar } from '../statusBar'

class ExtensionEmitter extends EventEmitter {}

export const extensionEmitter = new ExtensionEmitter()

extensionEmitter.on('updateSetting', () => {
  console.log('🚀 [coin-watcher - ExtensionEmitter] Emitting...')
  statusBar.onSettingUpdate()
})
