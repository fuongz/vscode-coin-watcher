import { ConfigurationChangeEvent, workspace, type ExtensionContext, type WorkspaceConfiguration } from 'vscode'
import { EXTENSION_ID } from './constants'
import { extensionEmitter } from './EventEmitters'

class Setting {
  config: WorkspaceConfiguration | null = null

  init(context: ExtensionContext) {
    console.log(`🚀 [${EXTENSION_ID} - Setting] Initialing...`)
    this.config = workspace.getConfiguration(EXTENSION_ID)
    context.subscriptions.push(workspace.onDidChangeConfiguration(this.onChange, setting))
    console.log(`🚀 [${EXTENSION_ID} - Setting] Initialized!`)
  }

  private onChange(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(EXTENSION_ID)) {
      return
    }
    this.config = workspace.getConfiguration(EXTENSION_ID)
    extensionEmitter.emit('updateSetting')
  }
}

export const setting = new Setting()
